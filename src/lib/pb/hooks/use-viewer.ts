import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { usePageContext } from "rakkasjs";
import type { PocketBaseClient } from "../client";
import { pbTryCatchWrapper } from "../utils";

export function useViewer() {
  const {
    tanstackQueryClient,
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
    const new_user = await pb?.from("property_user")?.authRefresh();
    return new_user.record;
  } catch (error: any) {
    return null;
  }
}
