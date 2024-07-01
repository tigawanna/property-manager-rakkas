import "rakkasjs";

declare module "rakkasjs" {
  interface PageLocals {
    pb: PocketBaseClient;
  }
  interface ServerSideLocals {
    pb: TPocketBaseClient;
  }
}
