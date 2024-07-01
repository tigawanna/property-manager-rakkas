import { OneProduct, OneProdyctSuspenseFallback } from "@/routes/products/[product]/_component/OneProduct";
import { Link, type PageProps } from "rakkasjs"
import { Suspense } from "react";
export default function OneProductPage({params}:PageProps) {
    const { product } = params;
return (
  <div className="w-full h-full  flex flex-col items-center justify-center">

    <Suspense fallback={<OneProdyctSuspenseFallback />}>
      <OneProduct productId={product} />
    </Suspense>
  </div>
);}
