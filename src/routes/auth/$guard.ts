import type { LookupHookResult, PageRouteGuardContext } from "rakkasjs";

export function pageGuard(ctx: PageRouteGuardContext): LookupHookResult {
  const user = ctx.locals.pb?.authStore?.model;
  if (!user) {
    return true;
  }
  return {
    redirect: ctx.url.origin,
  };
}
