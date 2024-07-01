import type { CollectionName } from "@/lib/pb/client";
import { usePocketbase } from "@/lib/pb/hooks/use-pb";
import { pbTryCatchWrapper } from "@/lib/pb/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { and, like, or } from "typed-pocketbase";
import { UpdateInventoryModal } from "../form/UpdateInventory";

import { TimestampOutPut } from "@/lib/dayjs/TimestampOutPut";



interface InventoryListProps {
  searchParamKey: string;
  debouncedValue: string;
  searchParam: string;
}

export function InventoryList({
  debouncedValue,
  searchParam,
  searchParamKey,
}: InventoryListProps) {
  const collectionName: CollectionName = "liquorstore_products_inventory";
  const page = debouncedValue.length > 0 ? 1 : searchParam;
  const { pb } = usePocketbase();

  const query = useSuspenseQuery({
    queryKey: [collectionName, String(page), debouncedValue],
    queryFn: () => {
      return pbTryCatchWrapper(
        pb?.from(collectionName).getList(+page, 24, {
          sort: "-created",
          filter: or(
            like("product.brand", debouncedValue),
            like("product.name", debouncedValue),
            // eq("verified", "yes")
          ),
          select: {
            expand: {
              product: {
                expand: {
                  brand: true,
                },
              },
            },
          },
        }),
      );
    },
  });
  const data = query?.data?.data ?? [];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="overflow-x-auto  lg:p-[5%]">
        <table className="table w-full">
          <thead className="bg-base-100">
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Size</th>
              <th className="hidden md:inline-block text-center">Created</th>
              <th className="hidden md:inline-block text-center pl-10">Updated</th>
              <th>edit</th>
            </tr>
          </thead>
          <tbody>
            {/* @ts-expect-error */}
            {data?.items?.map((item) => {
             
              return (
                <tr key={item.id} className="hover:bg-base-100">
                  <td>{item.expand.product.name}</td>
                  <td
                    className={
                      item.quantity > 0 ? "text-success text-xl font-bold" : "text-error text-xl font-bold"
                    }
                  >
                    {item.quantity}
                  </td>
                  <td>{item.size}</td>
                  <td className="hidden md:inline-block text-center ">
                    <TimestampOutPut
                      relative="footer"
                      timestamp={item.created}
                      mainClassName="text-xs"
                      relativeClassName="text-xs font-thin"
                    />
                  </td>
                  <td className="hidden md:inline-block text-center">
                    <TimestampOutPut
                      relative="footer"
                      timestamp={item.updated}
                      mainClassName="text-xs"
                      relativeClassName="text-xs font-thin"
                    />
                  </td>
                  <td>
                    <UpdateInventoryModal id={item.id} item={item} />
                  </td>
                </tr>
              );})}
          </tbody>
          {/* <tfoot></tfoot> */}
        </table>
      </div>
    </div>
  );
}
