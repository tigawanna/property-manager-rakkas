import type { CollectionName } from "@/lib/pb/client";
import { pbTryCatchWrapper } from "@/lib/pb/utils";
import { ClientSuspense, useSSQ } from "rakkasjs";
import { and, like } from "typed-pocketbase";
import { CreateCategoryModal } from "../form/CreateCategory";
import {
  DeleteCategoryModal,
  UpdateCategoryModal,
} from "../form/UpdateCategory";
import ClientSuspenseWrapper from "@/components/wrappers/ClientSuspenseWrapper";
import { usePocketbase } from "@/lib/pb/hooks/use-pb";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PBTimeStamp } from "@/lib/pb/components/time/PBTimestamp";

interface CategoriesListProps {
  searchParamKey: string;
  debouncedValue: string;
  searchParam: string;
}

export function CategoriesList({
  debouncedValue,
  searchParam,
  searchParamKey,
}: CategoriesListProps) {
  const collectionName: CollectionName = "liquorstore_categories";
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
        }),
      );
    },
  });
  const data = query?.data?.data ?? [];
  return (
    <div className="w-full h-full flex flex-col ">
      <div className="w-full flex flex-wrap  justify-center items-center gap-2 p-2 overflow--y-scroll">
        {data?.map((category) => (
          <div
            key={category.id}
            className="relative p-2 h-16 w-[95%] md:w-[45%] lg:w-[30%]   hover:brightness-75  flex  justify-between bg-base-100 gap-1 rounded-lg group "
          >
            <div className="w-full gap-[5%] flex flex-col ">
              <p className="text-xl font-bold">{category.name}</p>

              <PBTimeStamp
                timestamp={category.created}
                label="Created"
                className="justify-start text-sm"
              />
            </div>
            <div className="hidden group-hover:flex flex-col gap-2 ">
              <ClientSuspense
                fallback={<div className="size-4 bg-base-200 skeleton" />}
              >
                <ClientSuspenseWrapper>
                  <UpdateCategoryModal id={category.id} item={category} />
                </ClientSuspenseWrapper>
              </ClientSuspense>
              <ClientSuspense
                fallback={<div className="size-4 bg-base-200 skeleton" />}
              >
                <ClientSuspenseWrapper>
                  <DeleteCategoryModal id={category.id} />
                </ClientSuspenseWrapper>
              </ClientSuspense>
            </div>
          </div>
        ))}
        <div className="relative h-16 w-[95%] md:w-[45%] lg:w-[30%]  hover:brightness-75 transition-all  flex flex-col justify-between bg-base-100 gap-1 rounded-lg group ">
          <ClientSuspense
            fallback={<div className="size-5 bg-base-200 skeleton" />}
          >
            <ClientSuspenseWrapper>
              <CreateCategoryModal />
            </ClientSuspenseWrapper>
          </ClientSuspense>
        </div>
      </div>
    </div>
  );
}
