import { OneProdyctSuspenseFallback } from "@/routes/products/[product]/_component/OneProduct";
import type { PageProps } from "rakkasjs"
import { Suspense } from "react";
import { UpdateOneProduct } from "./_components/UpdateOneProduct";
export default function UpdateProductPage({params}:PageProps) {
const {product} = params
return (
  <div className="w-full h-full  flex flex-col items-center justify-center">
    <Suspense fallback={<OneProdyctSuspenseFallback />}>
      <UpdateOneProduct productId={product} />
    </Suspense>
  </div>
);}
