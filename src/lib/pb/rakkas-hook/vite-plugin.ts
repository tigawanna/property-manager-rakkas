import type { Plugin } from "vite";

export function rakkasPocketbase(): Plugin {
	return {
    name: "@rakkasjs/plugin-pocketbase",

    api: {
      rakkas: {
        // Initial slash means it's in project root and not in node_modules
        clientHooks: "/src/lib/pb/rakkas-hook/client-hooks.tsx",
        serverHooks: "/src/lib/pb/rakkas-hook/server-hooks.tsx",
      },
    },
  };
}
