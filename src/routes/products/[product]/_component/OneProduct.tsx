import { getFileURL, type CollectionName } from "@/lib/pb/client";
import { usePocketbase } from "@/lib/pb/hooks/use-pb";
import { pbTryCatchWrapper } from "@/lib/pb/utils";
import { PackOneProduct } from "@/routes/products/[product]/_component/PackOneProduct";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import { Link, Head } from "rakkasjs";
import { formatMilliLitres } from "../../_components/utils";

interface OneProductProps {
  productId: string;
}

export function OneProduct({ productId }: OneProductProps) {
  const { pb } = usePocketbase();
  const collectionName: CollectionName = "liquorstore_products";
  const query = useSuspenseQuery({
    queryKey: [collectionName, productId],
    queryFn: () => {
      return pbTryCatchWrapper(
        pb.from(collectionName).getOne(productId, {
          select: {
            expand: {
              brand: {
                name: true,
                id: true,
                expand: {
                  category: {
                    name: true,
                    id: true,
                  },
                },
              },
            },
          },
        }),
      );
    },
  });

  const product = query.data?.data;
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0, // Optional: Set minimum decimal places to 0 (no decimals)
    maximumFractionDigits: 2, // Optional: Set maximum decimal places to 2
  });

  if (!product) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
        <Link href="/admin/inventory/products">Go Back</Link>
      </div>
    );
  }
  const image_url = getFileURL({
    collection_id_or_name: collectionName,
    file_name: product.image,
    record_id: product.id,
  });
  const variants = product.variant;
  const prices_text = variants
    ?.map((v) => `${formatMilliLitres(v.size)} @ ${formatter.format(v.price)}`)
    .join("");
  const description_text = `Buy ${product.name} at Lavington Liquor ${prices_text} at the best prices and city wide deiveries in Nairobi Kenya Glovo,Jumia and ubers eats partner
      `;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 ">
      <Head
        title={`${product.name} | Lavington Liquor`}
        description={description_text}
        // og:description={description_text}
        // og:image={image_url}
        // og:title={`${product.name} | Lavington Liquor`}
        // twitter:title={`${product.name} | Lavington Liquor`}
        // twitter:image={image_url}
        // twitter:card={"summary_large_image"}
        // twitter:description={description_text}
      />
      <div className="w-full h-full flex  items-center  justify-center ">
        <h1 className="text-3xl font-bold p-1 md:p-2">{product.name}</h1>
      </div>
      <div
        className="relative h-full w-full flex flex-col xl:flex-row bg-base-300 
      justify-center items-center px-[5%] py-[1%]  gap-2 rounded-lg group "
      >
        <div className="w-full h-full flex flex-col md:flex-row min-w-fit bg-base-100 p-[2%] rounded-lg gap-5  ">
          <div className="h-full gap-2 flex justify-center">
            <Image
              alt={`image of ${product.name}`}
              // src={"/hero-image-mobile.webp"}
              className=""
              src={image_url}
              layout="constrained"
              width={400}
              height={340}
            />
          </div>
          {/* product descriptions */}
          <div className="w-full flex flex-col  min-w-fit  gap-3 divide-y    ">
            <div className="flex w-full justify-between gap-2  ">
              <div>Alcoholic content</div>
              <div> {product.abv}%</div>
            </div>
            <div className="flex w-full justify-between gap-2  ">
              <div>Category</div>
              <div> {product.expand?.brand?.expand?.category?.name}</div>
            </div>
            <div className="flex w-full justify-between gap-2  ">
              <div>Brand</div>
              <div> {product.expand?.brand?.name}</div>
            </div>
            <div className="flex w-full justify-between items-center gap-2   ">
              <div>Price</div>
              <ul className="text-xs">
                {variants?.map((v) => (
                  <li key={v.size} className="flex gap-1  ">
                    <div>{formatMilliLitres(v.size)}</div>
                    <div>@ {formatter.format(v.price)} Ksh</div>
                    <div>{v.quantity} in stock</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* order form */}
        <div className="w-full flex flex-col min-w-fit justify-center gap-0.5 p-[2%] bg-base-100 rounded-lg">
          <PackOneProduct oneProduct={product} />
        </div>
      </div>
      <div className="w-full">
        <div
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{ __html: product.description }}
          className="prose max-w-none prose-img:rounded-xl prose-headings:underline 
          prose-a:text-secondary  py-[1%] px-[5%] "
        />
      </div>
    </div>
  );
}

export function OneProdyctSuspenseFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3  ">
      <div className="w-full h-full flex  items-center  justify-center ">
        <div className="text-3xl font-bold p-1 md:p-2 h-7 w-[300px] bg-base-100 skeleton" />
      </div>
      <div
        className="relative h-full w-full flex flex-col xl:flex-row bg-base-200 
      justify-center items-center px-[5%] py-[1%]  gap-2 rounded-lg group "
      >
        <div className="w-full h-full flex flex-col md:flex-row min-w-fit  p-[2%] rounded-lg gap-5  ">
          <div className="w-full h-[300px] bg-base-200 skeleton rounded-lg" />

          {/* product descriptions */}
          <div className="w-full flex flex-col  min-w-fit  gap-3 divide-y    ">
            <div className="flex w-[40%] justify-between gap-2  h-7 bg-primary skeleton rounded-lg" />
            <div className="flex w-[60%] justify-between gap-2  h-7 bg-base-200 skeleton rounded-lg" />
            <div className="flex w-full justify-between gap-2  h-7 bg-base-200 skeleton rounded-lg" />
            <div className="flex w-full justify-between gap-2  h-7 bg-base-200 skeleton rounded-lg" />
            <div className="flex w-full justify-between gap-2  h-7 bg-base-200 skeleton rounded-lg" />
            <div className="flex w-full justify-between gap-2  h-7 bg-base-200 skeleton rounded-lg" />
            <div className="flex w-full justify-between gap-2  h-7 bg-base-200 skeleton rounded-lg" />
          </div>
        </div>
        <div
          className="relative h-full w-full flex flex-col xl:flex-row bg-base-200 p-[5%]
      justify-center items-center px-[5%] py-[1%]  gap-3 rounded-lg group "
        >
          <div className="w-full h-[300px] bg-base-200 skeleton rounded-lg" />
        </div>
      </div>
      <div className="w-[90%] rounded-lg h-[500px] bg-base-200 skeleton" />
    </div>
  );
}
