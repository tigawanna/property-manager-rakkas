import { ClientSuspense, Link } from "rakkasjs";
import { SideDrawer } from "./navigation/SideDrawer";
import { lazy } from "react";
import { ThemeSwitcher } from "./navigation/ThemeSwitcher";
import { Castle } from "lucide-react";
import { MiniSettingsModal } from "./navigation/mini-settings/MiniSettings";
const NavigationMenuLinks = lazy(
  () => import("./navigation/NavigationMenuLinks"),
);

interface MainToolbarProps {}

export function MainToolbar({}: MainToolbarProps) {
  return (
    <div className=" sticky top-0 z-30 flex  w-full items-center justify-between bg-inherit p-1">
      <Link href="/" className="p-2 text-2xl hover:text-secondary font-bold">
        <Castle />
      </Link>
      <div className="hidden items-center justify-end gap-2 px-2 md:flex">
        <ClientSuspense
          fallback={
            <div className="flex gap-2">
              <div className="h-9 w-[90px]  bg-base-300 skeleton " />
              <div className="h-9 w-[70px]  bg-base-300 skeleton " />
              <div className="h-9 w-[70px]  bg-base-300 skeleton " />
            </div>
          }
        >
          <NavigationMenuLinks />
        </ClientSuspense>
        <ClientSuspense
          fallback={
            <div className="size-9 rounded-full bg-base-300 skeleton " />
          }
        >
          <div className="flex gap-2 justify-center items-center">
            <MiniSettingsModal />
            <ThemeSwitcher />
          </div>
        </ClientSuspense>
      </div>
      {/* sidebar */}

      <div className="relative flex w-full justify-end p-2 md:hidden">
        <ClientSuspense
          fallback={<div className="h-6 bg-base-100 skeleton " />}
        >
          <SideDrawer />
        </ClientSuspense>
      </div>
    </div>
  );
}
