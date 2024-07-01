import { OneProdyctSuspenseFallback } from "@/routes/products/[product]/_component/OneProduct"
import type { PageProps } from "rakkasjs"
import { Inventory } from "./_components/inventory/list/Inventory"
export default function InventoryPage({}:PageProps) {
return (
<div className="w-full h-full  flex flex-col items-center justify-center">
    {/* <OneProdyctSuspenseFallback/> */}
    <Inventory/>
</div>
)}
