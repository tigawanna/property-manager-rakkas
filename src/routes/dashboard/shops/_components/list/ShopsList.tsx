import type { CollectionName } from "@/lib/pb/client";
import { pbTryCatchWrapper } from "@/lib/pb/utils";
import { like, or } from "typed-pocketbase";
import { usePocketbase } from "@/lib/pb/hooks/use-pb";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PBTimeStamp } from "@/lib/pb/components/time/PBTimestamp";
import { PBReturnedUseQueryError } from "@/components/error/PBReturnedUseQueryEror";

interface ShopsListProps {
  searchParamKey: string;
  debouncedValue: string;
  searchParam: string;
}

export function ShopsList({
  debouncedValue,
  searchParam,
  searchParamKey,
}: ShopsListProps) {
  const collectionName: CollectionName = "property_shops";
  const page = debouncedValue.length > 0 ? 1 : searchParam;

  const { pb } = usePocketbase();

  const query = useSuspenseQuery({
    queryKey: [collectionName, String(page), debouncedValue],
    queryFn: () => {
      return pbTryCatchWrapper(
        pb?.from(collectionName).getFullList({
          sort: "-order",
          filter: or(
            like("tenant.username", debouncedValue),
            like("shop_number", debouncedValue),
          ),
          select: {
            expand: {
              tenant: {
                username: true,
              },
            },
          },
        }),
      );
    },
  });
  const data = query?.data?.data ?? [];
  const error = query.data.error;

  if (error) {
    return (
      <div className="w-full h-full min-h-[90vh] flex flex-col justify-center items-center">
        <PBReturnedUseQueryError error={error} />
      </div>
    );
  }
  if (!data || !data.length) {
    return (
      <div className="w-full h-full min-h-[90vh] flex flex-col justify-center items-center">
        <PBReturnedUseQueryError error={new Error("No shops found")} />
      </div>
    );
  }
  return (
    <div className="w-full h-full min-h-screen flex flex-col ">
      <div className="w-full flex flex-wrap justify-center gap-2 p-2 overflow--y-scroll">
        {data.map((item) => (
          <div
            key={item.id}
            className="relative h-[100px] p-2 w-[95%] md:w-[45%] lg:w-[30%]  hover:brightness-75 justify-between  flex   bg-base-100 gap-1 rounded-lg group "
          >
            <div className="w-full gap-2 flex flex-col ">
              <h2 className="text-xl font-bold">{item.shop_number}</h2>
              <div className="badge badge-outline">
                {" "}
                {item.expand?.tenant?.username}
              </div>

              <PBTimeStamp
                timestamp={item.created}
                label="Created"
                className="justify-start"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
