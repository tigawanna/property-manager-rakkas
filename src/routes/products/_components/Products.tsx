import { SearchBox } from "@/components/search/SearchBox";
import { GenericDataCardsListSuspenseFallback } from "@/lib/pb/components/card-list/GenericDataCardsListSuspenseFallback";
import { useDebouncedSearchWithhParams } from "@/utils/hooks/search";
import { useCustomSearchParams } from "@/utils/hooks/use-custom-search-params";
import { Suspense } from "react";
import { ProductList } from "./ProductList";

interface ProductsProps {}

export function Products({}: ProductsProps) {
	const searchParamKey = "prd";
	const { isDebouncing, debouncedValue, setKeyword, keyword } =
		useDebouncedSearchWithhParams({ default_search_query: "" });
	const { searchParam } = useCustomSearchParams({
		key: searchParamKey,
		defaultValue: "1",
	});
	return (
    <div className="w-full h-full flex flex-col items-center py-5 ">
      <div className="w-full bg-base-200/30  sticky top-[10%] z-20  px-3 flex flex-col md:flex-row justify-evenly gap-3 pr-5">
        <div className="w-full flex gap-2 p-2">
          <h1 className="text-2xl font-bold  ">Products</h1>
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
      <div className="w-full h-[99vh] overflow-auto bg-base-200">
        <Suspense
          fallback={
            <GenericDataCardsListSuspenseFallback cardClassName="h-80 w-72" />
          }
        >
          <ProductList
            searchParamKey={searchParamKey}
            debouncedValue={debouncedValue}
            searchParam={searchParam}
          />
        </Suspense>
      </div>
    </div>
  );
}
