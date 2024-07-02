import { LayoutProps } from "rakkasjs";

export default function PrintLayout({ children }: LayoutProps) {
  return <div className="w-full h-full">{children}</div>;
}
