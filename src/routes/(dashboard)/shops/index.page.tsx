import { PageProps } from "rakkasjs";
import { Shops } from "./_components/list/Shops";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usePocketbase } from "@/lib/pb/hooks/use-pb";
import { pbTryCatchWrapper } from "@/lib/pb/utils";



export default function ShopsPage({}: PageProps) {
  const {pb}=usePocketbase()
  const query =useSuspenseQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      return pbTryCatchWrapper(pb?.from("property_staff").getList(1, 10, {
      }))
    },
  })
  console.log("query ================ ",query.data)
return (
<div className="w-full">
    {/* <Shops/> */}
    shops
</div>
  );
}
