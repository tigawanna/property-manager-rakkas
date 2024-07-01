import { Link, type LayoutProps } from "rakkasjs";
import { inventory_routes } from "./inventory-routes";
export default function AdminLayout({ children }: LayoutProps) {
  return (
    <div className="w-full h-full  flex flex-col items-center ">
      <nav className="w-full sticky top-[8%] bg-base-200/30 z-30 flex gap-2 items-center px-3 text-sm">
        {inventory_routes.map((route) => (
          <Link
            key={route.name}
            href={route.url}
            className="link hover:link-hover hover:text-sky-600"
          >
            {route.name}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
