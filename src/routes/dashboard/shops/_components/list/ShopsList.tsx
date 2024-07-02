import type { CollectionName } from "@/lib/pb/client";
import { pbTryCatchWrapper } from "@/lib/pb/utils";
import { like, or } from "typed-pocketbase";
import { usePocketbase } from "@/lib/pb/hooks/use-pb";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PBTimeStamp } from "@/lib/pb/components/time/PBTimestamp";
import { PBReturnedUseQueryError } from "@/components/error/PBReturnedUseQueryEror";
import { Link } from "rakkasjs";

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
        {data.map((shop) => (
          <div
            key={shop.id}
            style={{
              // filter: shop.is_vacant ? 'blur(1px)' : '',
              backgroundColor: shop.is_vacant ? "#3A0806" : "",
            }}
            className="border  border-accent rounded-lg 
                w-full p-5 md:w-[45%] lg:w-[30%] md:h-[200px] 
                flex flex-col gap-2 shadow-lg @container hover:brightness-95"
          >
            <Link
              href={`${shop.id}`}
              className="w-full h-full flex flex-col items-center 
                   "
            >
              {/*top  */}
              <div className="w-full flex flex-col items-end gap-1 ">
                <h2 className="font-bold text-6xl overflow-hidden overflow-elipsis w-full text-end">
                  {shop.shop_number}
                </h2>
                <div className="flex flex-col items-end gap-0">
                  {shop.is_vacant && (
                    <h2 className="text-accent font-bold">VACANT</h2>
                  )}
                </div>
              </div>

              {/*bottom */}
            </Link>
            <div className={"w-full flex gap-2 justify-end "}>
              <Link
                href={`/dashboard/tenants/${shop.tenant}`}
                className="text-2xl text-accent-content font-extralight overflow-hidden break-words hover:text-sky-400
                   "
              >
                {shop?.expand?.tenant?.username}
              </Link>
            </div>

            <div className="w-full flex  justify-between items-center px-2 ">
              {/* <UtilIcons utils={shop.utils} /> */}
              <h4 className="border  rounded-full p-1 aspect-square">
                {shop.order}
              </h4>
              {/* {shop && <MutateShopModal updating shop={shop} />} */}
              {/* <MutateShop
                user={user}
                shop={shop}
                updating
                custom_icon={{
                  Icon: FaRegEdit,
                  size: "20",
                }}
              /> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
