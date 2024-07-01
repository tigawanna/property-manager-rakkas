import { ListPagination } from "@/components/pagination/ReactresponsivePagination";
import type { CollectionName } from "@/lib/pb/client";
import { usePocketbase } from "@/lib/pb/hooks/use-pb";
import { pbTryCatchWrapper } from "@/lib/pb/utils";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import { useSuspenseQuery } from "@tanstack/react-query";
import { and, like } from "typed-pocketbase";

export type PBListCollectioncolumn<T extends Record<string, any>> = {
  [key in keyof T]: {
    name: string;
  };
};

interface PBListCollectionProps<T extends Record<string, any>> {
  filterBy: keyof T;
  columns: Partial<PBListCollectioncolumn<T>>;
  maxSelected?: number;
  collectionName: CollectionName;
  searchParamKey: string;
  debouncedValue: string;
  searchParam: string;
  selectedRows: T[];
  setSelectedRows: (selectedRows: T[]) => void;
}

export function PBListCollection<T extends Record<string, any> = Record<string, any>>({
  selectedRows,
  setSelectedRows,
  maxSelected = 1,
  collectionName,
  debouncedValue,
  searchParam,
  filterBy,
  columns,
  searchParamKey,
}: PBListCollectionProps<T>) {
  const page = debouncedValue.length > 0 ? 1 : searchParam;
  // console.log({selectedRows})
  //   const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { pb } = usePocketbase();
  const query = useSuspenseQuery({
    queryKey: [collectionName, String(page), debouncedValue],
    queryFn: () => {
      return pbTryCatchWrapper(
        pb?.from(collectionName).getList(+page, 12, {
          filter: and(
            // @ts-expect-error
            like(filterBy, debouncedValue),
            // eq("verified", "yes")
          ),
        }),
      );
    },
  });

  const data = query?.data?.data?.items ?? [];
  function selectItem(one_item: T) {
    if(maxSelected > 1){
      const is_in_array = selectedRows.find((item) => item.id === one_item.id);
      if (is_in_array) {
        setSelectedRows(selectedRows.filter((item) => item.id !== one_item.id));
      } else {
        setSelectedRows([...selectedRows, one_item]);
      }
      
    }else{
      setSelectedRows([one_item]);
    }
  }

  return (
    <div className="w-full h-full overflow-auto">
      <ul className="w-full h-full flex flex-col  gap-2 p-2">
        {data?.map((i) => {
          const checked = selectedRows.find((item) => item.id === i.id);
          return (
            <div
              className="w-full border rounded-lg p-2 flex items-center  gap-2"
              key={i.id}
            >
              <Checkbox
                checked={checked !== undefined}
                onCheckedChange={() => selectItem(i as any)}
              />
              {Object.entries(columns).map(([key, value]) => {
                return (
                  <div key={key + i.id} className="">
                    <div>{i[key as any as keyof typeof i]}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
        <div className="w-full">
          <ListPagination
            query_key={searchParamKey}
            total_pages={query?.data?.data?.totalPages ?? 1}
          />
        </div>
      </ul>
    </div>
  );
}
