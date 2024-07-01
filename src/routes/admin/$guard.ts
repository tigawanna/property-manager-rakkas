import type{ LookupHookResult, PageRouteGuardContext } from "rakkasjs";

export function pageGuard(ctx: PageRouteGuardContext): LookupHookResult {
    const session: string = ctx.queryClient.getQueryData("gh_token");
    console.log("======== admin guard $queryClient.getQueryData(gh_token) ====== ", session);
    return true
    // if (session) {
    //     return true;
    // }
    //     const url = new URL("/auth", ctx.url);
    //     url.searchParams.set("redirect_to", url.pathname + url.search);
    //     return { redirect: url };
}
