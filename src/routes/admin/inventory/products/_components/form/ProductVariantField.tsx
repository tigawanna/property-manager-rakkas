import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import type { LiquorstoreProductsVariants } from "@/lib/pb/custom-db-types";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface ProductVariantFieldProps {
  variants?: LiquorstoreProductsVariants;
  setVariants: (variant: LiquorstoreProductsVariants) => void;
}

export function ProductVariantField({
  variants,
  setVariants,
}: ProductVariantFieldProps) {
  const [variant, setVariant] = useState<LiquorstoreProductsVariants[number]>({
    price: 500,
    quantity: 1,
    size: 250,
  });

  function variantExists(v: LiquorstoreProductsVariants[number]) {
    return variants?.some((vr) => vr.size === v.size);
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setVariant((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  function updateVariants(v: LiquorstoreProductsVariants[number]) {
    if (!variantExists(v)) setVariants([...(variants ?? []), v]);
  }
  function removeVariant(v: LiquorstoreProductsVariants[number]) {
    setVariants(variants?.filter((vr) => vr.size !== v.size) ?? []);
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
      <div className="w-full ">
        <p className="font-serif font-semibold">Variants</p>
      </div>
      <ul className="w-full h-full flex flex-wrap   gap-1 pb-4 ">
        {variants?.map((v, i) => {
          return (
            <li
              key={v.size + v.quantity + v.price}
              className="flex w-fit gap-2 text-sm items-center bg-base-100/70 hover:bg-primary p-1 rounded-lg"
            >
              {`${v.quantity} items: ${v.size}ml @$${v.price}ksh `}
              <X
                onClick={() => removeVariant(v)}
                className="hover:text-error size-4"
              />
            </li>
          );
        })}
      </ul>
      <div className="w-full flex flex-col md:flex-row  gap-2 items-end">
        <div className="w-full flex flex-col md:flex-row items-end  gap-2">
          <TheTextInput<LiquorstoreProductsVariants[number]>
            field_name="size"
            field_key={"size"}
            type="number"
            onChange={handleChange}
            container_classname=""
            label_classname=""
            description_classname=""
            output_classname=""
            editing={true}
            description=""
            val={variant.size}
          />
          <TheTextInput<LiquorstoreProductsVariants[number]>
            field_name="price"
            type="number"
            field_key={"price"}
            onChange={handleChange}
            container_classname=""
            label_classname=""
            description_classname=""
            output_classname=""
            editing={true}
            description=""
            val={variant.price}
          />
          <TheTextInput<LiquorstoreProductsVariants[number]>
            field_name="quantity"
            field_key={"quantity"}
            onChange={handleChange}
            container_classname=""
            label_classname=""
            description_classname=""
            output_classname=""
            editing={true}
            description=""
            val={variant.quantity}
          />
        </div>
        <button
          type="button"
          disabled={variantExists(variant)}
          onClick={() => updateVariants(variant)}
          className=" rounded-lg btn btn-sm"
        >
          <Plus className="size-5" />
        </button>
      </div>
    </div>
  );
}
