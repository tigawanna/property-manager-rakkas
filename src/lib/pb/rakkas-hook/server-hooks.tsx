import { RequestContext } from "rakkasjs";
import type { ServerPluginFactory } from "rakkasjs/server";
import { TypedPocketBase } from "typed-pocketbase";
import { Schema } from "@/lib/pb/database";

function pocketbaseMiddleware(ctx: RequestContext) {
  ctx.locals.pb = new TypedPocketBase<Schema>(import.meta.env.RAKKAS_PB_URL);
  // load the store data from the request cookie string
  ctx.locals.pb.authStore.loadFromCookie(
    ctx.request.headers.get("cookie") || "",
  );
}
const pocketbaseServerHooksFactory: ServerPluginFactory = (_, options) => ({
  middleware: {
    beforePages: [],
    beforeApiRoutes: [],
    beforeNotFound: [],
    beforeAll: [pocketbaseMiddleware],
  },
  createPageHooks(requestContext) {
    return {
      extendPageContext(pageContext) {
        const request = requestContext;

        if (!request) return;
        if (!pageContext.locals.pb) {
          pageContext.locals.pb = new TypedPocketBase<Schema>(
            import.meta.env.RAKKAS_PB_URL,
          );

          // pageContext.locals.pb.authStore.loadFromCookie(
          //   request.headers.get("cookie") || "",
          // );

          pageContext.locals.pb.authStore.loadFromCookie(
            request?.request.headers?.get("cookie") ?? "",
          );
          // console.log("===CREATING NEW POCKETBASE USER= ===",pageContext.locals.pb?.authStore.model);
        }
        try {
          if (pageContext.locals.pb.authStore.isValid) {
            const user = pageContext?.locals?.pb;

            pageContext.tanstackQueryClient.setQueryData(
              ["viewer"],
              user?.authStore?.model,
            );
            // pageContext.queryClient.setQueryData(
            //   "user",
            //   user?.authStore?.model,
            // );
            console.log("===VALID USER , UPDATING POCKETBASE USER= ===");
          } else {
            console.log("====INVALID USER , LOGGING OUT POCKETBASE= ===");
            pageContext.locals.pb.authStore.clear();
            pageContext.tanstackQueryClient.setQueryData(["viewer"], null);
          }
        } catch (_) {
          // clear the auth store on failed refresh
          pageContext.locals.pb.authStore.clear();
        }
      },

      wrapApp(app) {
        return app;
      },
    };
  },
});

export default pocketbaseServerHooksFactory;
