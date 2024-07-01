import { Products } from "@/routes/products/_components/Products";
import { Plus } from "lucide-react";
import { Link, type PageProps } from "rakkasjs";

export default function InventoryProductsPage({}: PageProps) {
  return (
    <div className="w-full h-full  flex flex-col items-center justify-center">
      <div className="w-full flex  items-center justify-end px-3">
        <Link
          href="/admin/inventory/products/new"
          className="flex gap-2 btn btn-sm btn-secondary"
        >
          <Plus className="" />
          Add new product{" "}
        </Link>
      </div>
      <Products />
    </div>
  );
}
