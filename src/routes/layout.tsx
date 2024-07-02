import {
  ClientSuspense,
  usePageContext,
  type LayoutProps,
  type PreloadContext,
} from "rakkasjs";
import ErrorBoundaryComponent from "@/components/wrappers/ErrorBoundaryComponent";
import "./index.css";
import { TailwindIndicator } from "@/components/others/tailwind-indicator";
import { MainFooter } from "./_components/sections/MainFooter";
import { MainToolbar } from "@/routes/_components/sections/MainToolbar";
import { Toaster } from "@/components/shadcn/ui/sonner";
import { getSSRFriendlyTheme } from "@/lib/rakkas/theme";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@/components/pagination/pagination.css";

function MainLayout({ children }: LayoutProps) {



  return (
    <ErrorBoundaryComponent>
      <div className="flex h-full w-full  flex-col items-center justify-center bg-base-200 ">
        <MainToolbar />
        {children}
        <TailwindIndicator />
        <MainFooter />
        <ClientSuspense fallback={<div className="h-8 " />}>
          <Toaster richColors className="" />
        </ClientSuspense>
      </div>
    </ErrorBoundaryComponent>
  );
}
MainLayout.preload = (ctx: PreloadContext) => {
  const theme = getSSRFriendlyTheme(ctx.requestContext);
  return {
    head: {
      title: "Lavington liquor store",

      description:
        "fast, reliable, & affordable alcohol shopping in nairobi, kenya. explore pur wide collection of liquor , Wines & Spirits ",
      htmlAttributes: { "data-theme": theme },
      elements: [
        {
          tagName: "link",
          rel: "icon",
          type: "image/svg+xml",
          href: "/site.svg",
        },
      ],
      // htmlAttributes:{ "data-theme":"dark" }
    },
  };
};

export default MainLayout;
