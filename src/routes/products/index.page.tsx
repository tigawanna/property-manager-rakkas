import type { PageProps } from "rakkasjs"
import { Products } from "./_components/Products"
export default function ProductsPage({}:PageProps) {
return (
<div className="w-full h-full min-h-[60vh] flex flex-col items-center ">
    <Products/>
</div>
)}
