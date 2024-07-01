import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { usePageContext } from "rakkasjs";
import type { PocketBaseClient } from "../client";

export function useViewer() {
  const {
    locals: { pb },
  } = usePageContext();
  const query = useSuspenseQuery({
    queryKey: ["viewer"],
    queryFn: () => getViewer(pb),
    staleTime: 1000 * 60 * 60 * 24,
  });

  return query;
}

export async function getViewer(pb: PocketBaseClient) {
  try {
    const new_user = await pb?.from("liquorstore_user")?.authRefresh();
    return new_user.record;
  } catch (error: any) {
    return null;
  }
}
