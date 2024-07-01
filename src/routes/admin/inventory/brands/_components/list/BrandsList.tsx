import type { CollectionName } from "@/lib/pb/client";
import { pbTryCatchWrapper } from "@/lib/pb/utils";
import { ClientSuspense } from "rakkasjs";
import {
  type ResolveSelectWithExpand,
  type Select,
  and,
  like,
  ViewCollectionService,
  SelectWithExpand
} from "typed-pocketbase";

import ClientSuspenseWrapper from "@/components/wrappers/ClientSuspenseWrapper";
import { usePocketbase } from "@/lib/pb/hooks/use-pb";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PBTimeStamp } from "@/lib/pb/components/time/PBTimestamp";
import { CreateBrandModal } from "../form/CreateBrand";
import { UpdateBrandModal, DeleteBrandModal } from "../form/UpdateBrand";

interface BrandsListProps {
  searchParamKey: string;
  debouncedValue: string;
  searchParam: string;
}

export function BrandsList({
  debouncedValue,
  searchParam,
  searchParamKey,
}: BrandsListProps) {
  const collectionName: CollectionName = "liquorstore_brands";
  const page = debouncedValue.length > 0 ? 1 : searchParam;

  const { pb } = usePocketbase();

  const query = useSuspenseQuery({
    queryKey: [collectionName, String(page), debouncedValue],
    queryFn: () => {
      return pbTryCatchWrapper(
        pb?.from(collectionName).getFullList({
          sort: "-name",
          filter: and(
            like("name", debouncedValue),
            // eq("verified", "yes")
          ),
          select: {
            expand: {
              category: {
                name: true,
                id: true,
              },
            },
          },
        }),
      );
    },
  });
  const data = query?.data?.data ?? [];


  return (
    <div className="w-full h-full flex flex-col ">
      <div className="w-full flex flex-wrap justify-center gap-2 p-2 overflow--y-scroll">
        {data.map((item) => (
          <div
            key={item.id}
            className="relative h-[100px] p-2 w-[95%] md:w-[45%] lg:w-[30%]  hover:brightness-75 justify-between  flex   bg-base-100 gap-1 rounded-lg group "
          >
            <div className="w-full gap-2 flex flex-col ">
              <h2 className="text-xl font-bold">{item.name}</h2>
              <div className="badge badge-outline">
                {" "}
                {item.expand?.category?.name}
              </div>

              <PBTimeStamp
                timestamp={item.created}
                label="Created"
                className="justify-start"
              />
            </div>
            {item&&
            <div className="hidden group-hover:flex flex-col gap-2 p-1">
              <ClientSuspense
                fallback={<div className="size-4 bg-base-200 skeleton" />}
              >
                <ClientSuspenseWrapper>
                  <UpdateBrandModal id={item.id} item={item} />
                </ClientSuspenseWrapper>
              </ClientSuspense>
              <ClientSuspense
                fallback={<div className="size-4 bg-base-200 skeleton" />}
              >
                <ClientSuspenseWrapper>
                  <DeleteBrandModal id={item.id} />
                </ClientSuspenseWrapper>
              </ClientSuspense>
            </div>}
          </div>
        ))}
        <div className="relative h-[100px] w-[95%] md:w-[45%] lg:w-[30%]  hover:brightness-75 transition-all  flex flex-col justify-between bg-base-100 gap-1 rounded-lg group ">
          <ClientSuspense
            fallback={
              <div className="h-[100px] w-[95%] md:w-[45%] lg:w-[30%]  bg-base-200 skeleton" />
            }
          >
            <ClientSuspenseWrapper>
              <CreateBrandModal />
            </ClientSuspenseWrapper>
          </ClientSuspense>
        </div>
      </div>
    </div>
  );
}
