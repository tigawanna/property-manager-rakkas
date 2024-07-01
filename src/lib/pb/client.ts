import PocketBase from "pocketbase";
import type { RequestContext } from "rakkasjs";
import type{ TypedPocketBase } from "typed-pocketbase";
import type { Schema } from "./database";

export type PocketBaseClient = TypedPocketBase<Schema>;

const RAKKAS_PB_URL = import.meta.env.RAKKAS_PB_URL;

export type CollectionName = keyof Schema;

export function getFileURL({
  collection_id_or_name,
  file_name,
  record_id,
  fallback="",
}: {
  collection_id_or_name?: CollectionName;
  record_id?: string;
  file_name?: string;
  fallback?: string;
}) {
  if (!collection_id_or_name || !file_name || !record_id) {
    return fallback;
  }
  // http://127.0.0.1:8090/api/files/COLLECTION_ID_OR_NAME/RECORD_ID/FILENAME?thumb=100x300
  return `${RAKKAS_PB_URL}/api/files/${collection_id_or_name}/${record_id}/${file_name}`;
}

export async function serverSidePocketBaseInstance(
  ctx: RequestContext<unknown>,
) {
  try {
    const pb_cookie = ctx.request.headers.get("cookie") ?? "";
    const pb = new PocketBase(RAKKAS_PB_URL) as PocketBaseClient;
    pb.authStore.loadFromCookie(pb_cookie);
    return pb;
  } catch (error) {
    // biome-ignore lint/complexity/noUselessCatch: <explanation>
    throw error;
  }
}
export async function serverSideAdminPocketBaseInstance(
  ctx: RequestContext<unknown>,
) {
  try {
    if (!process.env.RAKKAS_ADMIN_USERNAME) {
      throw new Error("PB_ADMIN_USERNAME is not defined");
    }
    if (!process.env.RAKKAS_ADMIN_PASSWORD) {
      throw new Error("PB_ADMIN_PASSWORD is not defined");
    }
    const pb = new PocketBase(
      import.meta.env.RAKKAS_PB_URL,
    ) as PocketBaseClient;
    await pb.admins.authWithPassword(
      process.env.RAKKAS_ADMIN_USERNAME,
      process.env.RAKKAS_ADMIN_PASSWORD,
    );
    return pb;
  } catch (error) {
    // biome-ignore lint/complexity/noUselessCatch: <explanation>
    throw error;
  }
}
