import type { ClientPluginFactory } from "rakkasjs/client";
import { Schema } from "@/lib/pb/database";
import { TypedPocketBase } from "typed-pocketbase";

const pocketbaseClientHooksFactory: ClientPluginFactory = (_, options) => {
  return {
    extendPageContext: {
      order: "pre",
      handler(pageContext) {
        if (!pageContext.locals.pb) {
          pageContext.locals.pb = new TypedPocketBase<Schema>(
            import.meta.env.RAKKAS_PB_URL,
          );
          pageContext.locals.pb?.authStore.onChange(() => {
            pageContext.requestContext?.setCookie?.(
              "set-cookie",
              pageContext.locals.pb?.authStore.exportToCookie(),
            );
          });
        }
      },
    },


  };
};

export default pocketbaseClientHooksFactory;
