import type { PageProps } from "rakkasjs"
import { Brands } from "./_components/list/Brands";
export default function InventoryBrandsPage({}:PageProps) {
return (
	<div className="w-full h-full  flex flex-col items-center justify-center">
		<Brands/>
	</div>
);}
