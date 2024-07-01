import type { CollectionName } from "@/lib/pb/client";
import { usePocketbase } from "@/lib/pb/hooks/use-pb";
import { pbTryCatchWrapper } from "@/lib/pb/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { UpdateProduct } from "../../_components/form/UpdateProduct";
import { Link } from "rakkasjs";


interface UpdateOneProductProps {
  productId: string;
}

export function UpdateOneProduct({
  productId,
}: UpdateOneProductProps) {
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
  const data = query.data?.data;

  if (!data) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
        <Link href="/admin/inventory/products">Go Back</Link>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
        {/* @ts-expect-error */}
      <UpdateProduct id={productId} item={data} setOpen={() => {}} />
    </div>
  );
}
