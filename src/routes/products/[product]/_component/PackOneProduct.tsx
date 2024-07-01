import { Button } from "@/components/shadcn/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/ui/select";
import type { LiquorstoreProductsResponse } from "@/lib/pb/database";
import { ExternalLink, Minus, Plus } from "lucide-react";
import { ClientSuspense, Link } from "rakkasjs";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

interface PackOneProductProps {
  oneProduct: LiquorstoreProductsResponse;
}

export function PackOneProduct({ oneProduct }: PackOneProductProps) {
  const [order, setOrder] = useState<{
    quantity: number;
    size: number;
    price: number;
  }>({
 
    quantity: 1,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    size: oneProduct?.variant?.at(0)?.size!,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    price: oneProduct?.variant?.at(0)?.price!,
  });
  
  const variants = oneProduct.variant;
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0, // Optional: Set minimum decimal places to 0 (no decimals)
    maximumFractionDigits: 2, // Optional: Set maximum decimal places to 2
  });

  function matchPriceToSize(size:number){
    return variants?.find((v) => v.size === size)?.price ?? 0
  }
  function matchPriceToQuantity(size:number){
    return variants?.find((v) => v.size === size)?.quantity ?? 0
  }
  return (
    <div className="w-full  flex flex-col gap-10 md:gap-4 rounded-lg">
      <div className="w-full  flex h-full gap-3 ">
        <div className="w-full text-3xl flex  gap-4">
          <Button
            type="button"
            disabled={order.quantity <= 1}
            onClick={() =>
              setOrder((prev) => ({ ...prev, quantity: prev.quantity - 1 }))
            }
          >
            <Minus />
          </Button>
          {order?.quantity}
          <Button
            type="button"
            disabled={order.quantity >= matchPriceToQuantity(order.size)}
            onClick={() =>
              setOrder((prev) => ({ ...prev, quantity: prev.quantity + 1 }))
            }
          >
            <Plus />
          </Button>
        </div>

        <div className="w-full  flex gap-2 ">
          <ClientSuspense fallback={<div className="w-full h-9 "/>}>
          <Select
            value={String(order.size)}
            onValueChange={(v) => {
              setOrder((prev) => ({ ...prev, size: Number(v) }));
            }}
          >
            <SelectTrigger className="min-w-[100px]">
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {variants?.map((variant, i) => {
                  return (
                    <SelectItem
                      key={variant.size}
                      value={String(variant?.size)}
                    >
                      {variant?.size} ml
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          </ClientSuspense>
        </div>
      </div>
      {/* total */}
      <div className="w-full flex flex-col gap-2">
        <div className="text-4xl">
          Total{" "}
          {formatter.format(matchPriceToSize(order.size) * order.quantity)} Ksh
        </div>
        <div className="w-full flex flex-col  gap-3">
          <h2 className="font-bold">Order on</h2>
          <div className="w-full flex flex-wrap justify-center gap-3">
            <Link
            // hi lavingnton liquor store
              href={`https://wa.me/+254711111111?text=Hello%20lavington%20liquor%20store%2C%20I%20want%20to%20order%20${order.quantity}%20${order.size}ml%20${oneProduct?.name}`}
              target="_blank"
              className="flex gap-2 btn btn-primary hover:text-secondary hover:link-hover"
            >
              <FaWhatsapp className="size-4" />{" "}
              <ExternalLink className="size-4" />
            </Link>
            <Link className="flex gap-2 btn btn-primary hover:text-secondary hover:link-hover">
              Glovo <ExternalLink className="size-4" />
            </Link>
            <Link className="flex gap-2 btn btn-primary hover:text-secondary hover:link-hover">
              Jumia <ExternalLink className="size-4" />
            </Link>
            <Link className="flex gap-2 btn btn-primary hover:text-secondary hover:link-hover">
              Uber eats <ExternalLink className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
