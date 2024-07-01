import { Link, type PageProps } from "rakkasjs";
import { Suspense } from "react";
import {
  OneProduct,
  OneProdyctSuspenseFallback,
} from "./_component/OneProduct";
import { Edit } from "lucide-react";
export default function OneProductPage({ params }: PageProps) {
  const { product } = params;
  return (
    <div className="w-full h-full  flex flex-col items-center justify-center">
      <div className="w-full flex gap-2">
        <Link className="btn btn-sm" href={`/admin/inventory/products/${product}/update`}>update <Edit className="w-4 h-4"/></Link>
      </div>
      <Suspense fallback={<OneProdyctSuspenseFallback />}>
        <OneProduct productId={product} />
      </Suspense>
    </div>
  );
}
