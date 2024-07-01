import type { LookupHookResult, PageRouteGuard } from "rakkasjs";

export const pageGuard: PageRouteGuard = (ctx) => {
  // Selectively disable the catch-all page route for /foo/bar
  const viewer = ctx.tanstackQueryClient.getQueryData<any>(["viewer"]);
  console.log("======== dashboard guard $queryClient.getQueryData(viewer) ====== ", viewer);
  if(viewer) return true
  const redirectTo = new URL("/auth", ctx.url);
  redirectTo.searchParams.set("return_to", ctx.url.pathname);
  return {
    redirect: redirectTo,
  }

};
