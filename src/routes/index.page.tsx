import type { PageProps } from "rakkasjs";
import { DashboardLinks } from "./_components/landing/DashboardLinks";

export default function HomePage({}: PageProps) {
  return (
    <main className="flex h-fit w-full flex-col  items-center ">
      <DashboardLinks />
    </main>
  );
}
