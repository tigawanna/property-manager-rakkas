import type { PageProps } from "rakkasjs"
import { Categories } from "./_components/list/Categories";
export default function InventoryCategoryPage({}:PageProps) {
return (
	<div className="w-full h-full  flex flex-col items-center justify-center">
		<Categories/>
	</div>
);}
