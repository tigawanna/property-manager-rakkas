import { getFileURL, type CollectionName } from "@/lib/pb/client";
import { pbTryCatchWrapper } from "@/lib/pb/utils";
import { Link, useLocation, useSSQ } from "rakkasjs";
import { and, like, eq } from "typed-pocketbase";
import { Image } from "@unpic/react";

interface ProductListProps {
  searchParamKey: string;
  debouncedValue: string;
  searchParam: string;
}

export function ProductList({
  debouncedValue,
  searchParam,
  searchParamKey,
}: ProductListProps) {
  const collectionName: CollectionName = "liquorstore_products";
  const page = debouncedValue.length > 0 ? 1 : searchParam;
  const { current } = useLocation();
  const category =
    current.searchParams.get("category")?.toLowerCase()?.trim() ?? "";
  const query = useSSQ(
    (ctx) => {
      console.log("category", category);
      return pbTryCatchWrapper(
        ctx?.locals?.pb?.from(collectionName).getList(+page, 12, {
          sort: "+name",
          filter: and(
            like("name", debouncedValue),
            like("brand.category.name", category),
          ),
        }),
      );
    },
    {
      queryKey: `${collectionName}_${page}_${searchParamKey}_${category}`,
    },
  );
  const data = query?.data?.data?.items ?? [];
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0, // Optional: Set minimum decimal places to 0 (no decimals)
    maximumFractionDigits: 2, // Optional: Set maximum decimal places to 2
  });

  if (data?.length === 0 || !data) {
    return (
      <div className="w-full min-h-[70%]  flex flex-col items-center justify-center   gap-5 md:gap-3 p-2">
        <div className="bg-base-100 p-[6%] rounded-lg">
          {category ? (
            <div className="flex flex-col justify-center items-center gap-5">
              <h1 className="text-4xl font-bold ">No {category} found</h1>
              <p className="text-lg">Try a different category</p>
            </div>
          ) : (
            <h1 className="text-4xl font-bold ">No products found</h1>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col justify-center items-center   gap-5 md:gap-3 p-2 ">
      <h1 className="text-2xl font-bold pl-4">{category}</h1>
    <div className="w-full flex flex-wrap justify-center   gap-5 md:gap-3 p-2">

      {data.map((product) => {
        const image_url = getFileURL({
          collection_id_or_name: collectionName,
          file_name: product.image,
          record_id: product.id,
        });

        const variants = product.variant as { size: number; price: number }[];
        return (
          <Link
            href={`/products/${product.id}`}
            key={product.id}
            className="relative h-80 w-72 hover:brightness-75 
            flex flex-col justify-between bg-base-100 gap-1 rounded-xl group "
          >
            <Image
              src={image_url}
              layout="constrained"
              width={300}
              height={240}
            />
            <div className="flex flex-col px-3 pb-2 imn-w-fit">
              <h1 className="text-lg font-medium brightness-90 line-clamp-1">
                {product.name}
              </h1>
              <div className="text-xs">{product.abv}% ABV</div>
              <div className="text-xs">
                {product.availability.replace("_", " ")}
              </div>

              {variants && variants.length > 1 ? (
                <div className="text-sm flex gap-1 min-w-fit">
                  {formatter.format(variants?.at(0)?.price ?? 0)} Ksh -{" "}
                  {formatter.format(variants?.at(-1)?.price ?? 0)} Ksh
                </div>
              ) : (
                <div className="text-sm flex gap-1 min-w-fit">
                  {formatter.format(variants?.at(0)?.price ?? 0)} Ksh
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
    </div>
  );
}
