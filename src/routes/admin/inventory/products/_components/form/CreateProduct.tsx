import { useFormHook } from "@/components/form/useForm";
import { sonnerToast } from "@/components/shadcn/misc/sonner-taost";
import type { CollectionName } from "@/lib/pb/client";
import { PBFormSelect } from "@/lib/pb/components/form/input-parts/PBFormSelect";
import { PbTheTextInput } from "@/lib/pb/components/form/input-parts/PBTheTextInput";
import { PBPickRelationField } from "@/lib/pb/components/form/input-parts/PBrelationPicker";
import { PBTheImagePicker } from "@/lib/pb/components/form/input-parts/PbTheImagePicker";
import type {
  LiquorstoreBrandsResponse,
  LiquorstoreProductsCreate,
} from "@/lib/pb/database";
import { usePocketbase } from "@/lib/pb/hooks/use-pb";
import { pbTryCatchWrapper } from "@/lib/pb/utils";
import { SpinnerButton } from "@/lib/tanstack/components/SpinnerButton";
import { mapZodIssueToField } from "@/lib/zod/utils";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { ProductVariantField } from "./ProductVariantField";
import { ProductDescriptionEditor } from "./ProductDescriptionEditor";
import { CreateProductSchema } from "./schema";
import { ClientSuspense } from "rakkasjs";




type BrandsRecordBrandsExpand = Pick<LiquorstoreBrandsResponse, "id" | "name">;
interface CreateProductProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateProduct({ setOpen }: CreateProductProps) {
  const collectionName: CollectionName = "liquorstore_products";

  const [brands, setBrands] = useState<BrandsRecordBrandsExpand[] | undefined>(
    [],
  );

  const { pb, viewer } = usePocketbase();
  const { input, errors, handleChange, setInput, setErrors } =
    useFormHook<LiquorstoreProductsCreate>({
      initialValues: {
        name: "",
        abv: 5,
        availability: "in_stock",
        brand: "",
        image: null,
        variant: [],
        description: "",
      },
    });
  const mutation = useMutation({
    mutationFn: (data: LiquorstoreProductsCreate) => {
      return pbTryCatchWrapper(pb.from(collectionName).create(data));
    },
    meta: { invalidates: [collectionName] },
    onSuccess: (data) => {
      if (data) {
        if (data.data) {
          sonnerToast({
            type: "success",
            title: "New product added",
          });

          setOpen(false);
        }
        // if (data.error) {
        //   sonnerToast({
        //     type: "error",
        //     title: "Something went wrong while creating new brand",
        //     options: {
        //       description: data.error.message,
        //     },
        //   });
        // }
      }
    },
    // onError: (error: any) => {
    //   sonnerToast({
    //     type: "error",
    //     title: "Something went wrong while creating new brand",
    //     options: {
    //       description: error.message,
    //     },
    //   });
    // },
  });
  const pb_error = mutation.data?.error;
  const error_message = mutation.error?.message ?? pb_error?.message;
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const schemaParse = CreateProductSchema.safeParse(input);
      if (schemaParse.success) {
        mutation.mutate(input);
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        const zod_errors = Object.keys({ ...input }).reduce((acc: any, key) => {
          acc[key] = {
            name: `${key} error`,
            message: mapZodIssueToField(e, key),
          };
          return acc;
        }, {});
        setErrors(zod_errors);
      }
    }
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-3">
      <form
        className="size-full flex flex-col gap-5 p3"
        onSubmit={handleSubmit}
      >
        <PbTheTextInput<LiquorstoreProductsCreate>
          field_key={"name"}
          field_name={"Name"}
          onChange={handleChange}
          val={input.name}
          pb_error={pb_error}
          error_message={errors?.name.message}
        />
        <PBTheImagePicker
          field_name={"image"}
          label_classname={"w-full"}
          img_classname={"w-full"}
          show_preview={true}
          collection_id_or_name={"liquorstore_products"}
          setFileImage={(file) => {
            setInput({ ...input, image: file });
          }}
        />

        <div className="w-full flex gap-3 justify-between">
          <PbTheTextInput<LiquorstoreProductsCreate>
            field_key={"abv"}
            field_name={"Alcohol by Volume (%)"}
            type="number"
            onChange={handleChange}
            val={input.abv}
            pb_error={pb_error}
            error_message={errors?.abv.message}
          />
          <ClientSuspense
            fallback={<div className="h-9 bg-base-200 skeleton " />}
          >
            <PBFormSelect<LiquorstoreProductsCreate, "availability">
              fieldKey={"availability"}
              fieldLabel={"Availability"}
              setInput={setInput}
              fieldOptions={{
                fields: [
                  {
                    value: "in_stock",
                    label: "In Stock",
                  },
                  {
                    value: "out_of_stock",
                    label: "Out of Stock",
                  },
                ],
                type: "select",
              }}
              input={input}
              fieldError={errors?.availability.message}
              pbFieldError={pb_error}
            />
          </ClientSuspense>
        </div>

        <PBPickRelationField<BrandsRecordBrandsExpand>
          dialogTrigger={<span className="btn btn-outline btn-sm">Brand</span>}
          selectedRows={brands}
          maxSelected={1}
          setSelectedRows={(itm) => {
            if (Array.isArray(itm)) {
              setBrands(itm as any);
              setInput((prev) => ({ ...prev, brand: itm.at(-1)?.id ?? "" }));
            }
          }}
          collectionName="liquorstore_brands"
          columns={{
            name: {
              name: "name",
            },
          }}
          fieldLabel="Brand"
          searchParamKey="pbs"
          filterBy="name"
        />
        <ProductVariantField
          variants={input.variant}
          setVariants={(v) => setInput({ ...input, variant: v })}
        />
        <ProductDescriptionEditor
          description={input.description ?? ""}
          setDescription={(d) => setInput({ ...input, description: d })}
        />

        <SpinnerButton mutation={mutation} />
      </form>
    </div>
  );
}
