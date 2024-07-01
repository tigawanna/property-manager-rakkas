import { SearchBox } from "@/components/search/SearchBox";
import { GenericDataCardsListSuspenseFallback } from "@/lib/pb/components/card-list/GenericDataCardsListSuspenseFallback";
import { useDebouncedSearchWithhParams } from "@/utils/hooks/search";
import { useCustomSearchParams } from "@/utils/hooks/use-custom-search-params";
import { Suspense } from "react";
import { BrandsList } from "./BrandsList";

interface BrandsProps {}

export function Brands({}: BrandsProps) {
  const searchParamKey = "cat";
  const { isDebouncing, debouncedValue, setKeyword, keyword } =
    useDebouncedSearchWithhParams({ default_search_query: "" });
  const { searchParam } = useCustomSearchParams({
    key: searchParamKey,
    defaultValue: "1",
  });
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full z-20 bg-base-200 sticky top-[10%]  px-3 flex flex-col md:flex-row justify-evenly gap-3 pr-5">
        <div className="w-full flex gap-2 p-2">
          <h1 className="text-2xl font-bold bg-base-200/30 ">Brands</h1>
          {/* <AddNewTechFormModal /> */}
          {/* <AddNewUserProjectFormModal /> */}
        </div>
        <SearchBox
          inputProps={{
            placeholder: "Search by name",
          }}
          debouncedValue={debouncedValue}
          isDebouncing={isDebouncing}
          setKeyword={setKeyword}
          keyword={keyword}
        />
      </div>
      <div className="w-full  ">
        <Suspense
          fallback={
            <GenericDataCardsListSuspenseFallback 
            cardClassName="h-[100px] p-1 w-[95%] md:w-[45%] lg:w-[30%]  hover:brightness-75 justify-between  flex   bg-base-300 gap-1 rounded-lg group" />
          }
        >
          <BrandsList
            searchParamKey={searchParamKey}
            debouncedValue={debouncedValue}
            searchParam={searchParam}
          />
        </Suspense>
      </div>
    </div>
  );
}
