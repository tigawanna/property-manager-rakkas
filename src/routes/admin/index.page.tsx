import { Link, type PageProps } from "rakkasjs";
import { inventory_routes } from "./inventory/inventory-routes";
export default function AdminPage({}: PageProps) {
  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center gap-5 justify-center">
		<h2 className="text-lg md:text-3xl font-bold">
			Admin panel
		</h2>
      <nav className="w-full h-full flex justify-center items-center  z-30 gap-2  px-3">
        {inventory_routes.map((route) => (
          <Link
            key={route.name}
            href={route.url}
            className="bg-base-300 p-5 hover:bg-base-300/60 hover:text-sky-600   rounded-lg"
          >
            {route.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
