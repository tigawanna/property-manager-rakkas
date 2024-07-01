import { PropertyShopsCreate } from "@/lib/pb/database";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/ui/select";
import { floors, PropertyFloorPrefixes } from "./floors";
import { useTransition } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { pbTryCatchWrapper } from "@/lib/pb/utils";
import { usePocketbase } from "@/lib/pb/hooks/use-pb";
import { like } from "typed-pocketbase";
interface ShopNumberInputProps {
  input: PropertyShopsCreate & { floor: PropertyFloorPrefixes };
  setInput: React.Dispatch<
    React.SetStateAction<PropertyShopsCreate & { floor: PropertyFloorPrefixes }>
  >;
}

export function ShopNumberInput({input,setInput }: ShopNumberInputProps) {
  const {pb} = usePocketbase()  
  const shopsQuery = useSuspenseQuery({
    queryKey: ["property_shops", input.floor],
    queryFn: () => {
      return pbTryCatchWrapper(
        pb.from("property_shops").getList(1, 10, {
          sort: "+order",
          filter:like("shop_number",input.floor),
        })
      );
    }
  })
  const shopNumbers = shopsQuery?.data?.data?.items.map((s)=>s.shop_number)
  console.log({shopNumbers})
  const [_, startTransition] = useTransition();
  const floors_list = Object.entries(floors);
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full flex flex-col items-center justify-center">
        <Select
          onValueChange={(v: PropertyFloorPrefixes) => startTransition(() => setInput((prev) => ({ ...prev, floor: v })))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a floor" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Floors</SelectLabel>
              {floors_list.map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
