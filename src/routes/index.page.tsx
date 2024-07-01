import type { PageProps } from "rakkasjs";
import { DashboardLinks } from "./_components/landing/DashboardLinks";
import { usePocketbase } from "@/lib/pb/hooks/use-pb";
import { pbTryCatchWrapper } from "@/lib/pb/utils";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function HomePage({}: PageProps) {

  return (
    <main className="flex h-fit w-full flex-col  items-center ">
      <DashboardLinks />
    </main>
  );
}
