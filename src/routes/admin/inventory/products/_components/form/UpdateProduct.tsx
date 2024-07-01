import { useFormHook } from "@/components/form/useForm";
import { sonnerToast } from "@/components/shadcn/misc/sonner-taost";
import type { CollectionName } from "@/lib/pb/client";
import { PBFormSelect } from "@/lib/pb/components/form/input-parts/PBFormSelect";
import { PbTheTextInput } from "@/lib/pb/components/form/input-parts/PBTheTextInput";
import { PBPickRelationField } from "@/lib/pb/components/form/input-parts/PBrelationPicker";
import { PBTheImagePicker } from "@/lib/pb/components/form/input-parts/PbTheImagePicker";
import type {
  LiquorstoreBrandsResponse,
  LiquorstoreProductsUpdate,
} from "@/lib/pb/database";
import { usePocketbase } from "@/lib/pb/hooks/use-pb";
import { pbTryCatchWrapper } from "@/lib/pb/utils";
import { SpinnerButton } from "@/lib/tanstack/components/SpinnerButton";
import { mapZodIssueToField } from "@/lib/zod/utils";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { ProductDescriptionEditor } from "./ProductDescriptionEditor";
import { ProductVariantField } from "./ProductVariantField";
import { useState } from "react";
import { FormErrors, GeneralFormError } from "@/components/error/FormErrors";
import { ClientSuspense } from "rakkasjs";

interface UpdateProductProps {
  id: string;
  item: LiquorstoreProductsUpdate&{
    expand?:{
      brand:Partial<LiquorstoreBrandsResponse>
    }
  }
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
type BrandsRecordBrandsExpand = Pick<LiquorstoreBrandsResponse, "id" | "name">;

export function UpdateProduct({ id, item, setOpen }: UpdateProductProps) {
  const collectionName: CollectionName = "liquorstore_products";
  const [brands, setBrands] = useState<BrandsRecordBrandsExpand[] | undefined>(
    [],
  );
  const { pb, viewer } = usePocketbase();
  const { input, handleChange, setInput, errors, setErrors } =
    useFormHook<LiquorstoreProductsUpdate>({
      initialValues: {
        name: item.name,
        description: item.description,
        image: item.image,
        abv: item.abv,
        brand: item.brand,
        availability: item.availability,
        variant: item.variant,
      },
    });
  const mutation = useMutation({
    mutationFn: (data: LiquorstoreProductsUpdate) => {
      return pbTryCatchWrapper(pb.from(collectionName).update(id, data));
    },
    meta: { invalidates: [collectionName] },
    onSuccess: (data) => {
      if (data) {
        if (data.data) {
          sonnerToast({
            type: "success",
            title: "Product updated",
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
      // UpdateProductSchema.parse(input);
      mutation.mutate(input);
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
  console.log({item})
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-[2%]">
      <form
        className="h-full w-[90%] lg:w-[70%] flex flex-col gap-5 p-[3%] bg-base-300 rounded-lg"
        onSubmit={handleSubmit}
      >
        <PbTheTextInput<LiquorstoreProductsUpdate>
          field_key={"name"}
          field_name={"Name"}
          onChange={handleChange}
          val={input.name}
          pb_error={pb_error}
          error_message={errors?.name?.message}
        />

        <FormErrors errors={errors} fieldKey="image">
          <PBTheImagePicker
            field_name={"image"}
            label_classname={"w-full"}
            img_classname={"w-full"}
            show_preview={true}
            collection_id_or_name={"liquorstore_products"}
            record_id={id}
            // @ts-expect-error
            file_name={input.image}
            setFileImage={(file) => {
              setInput({ ...input, image: file });
            }}
          />
        </FormErrors>

        <div className="w-full flex gap-3 justify-between">
          <PbTheTextInput<LiquorstoreProductsUpdate>
            field_key={"abv"}
            field_name={"Alcohol by Volume (%)"}
            type="number"
            onChange={handleChange}
            val={input.abv}
            pb_error={pb_error}
            error_message={errors?.abv?.message}
          />
          <ClientSuspense
            fallback={<div className="h-9 bg-base-200 skeleton " />}
          >
            <PBFormSelect<LiquorstoreProductsUpdate, "availability">
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
              fieldError={errors?.availability?.message}
              pbFieldError={pb_error}
            />
          </ClientSuspense>
        </div>
        <div className="w-full flex flex-col  gap-1">
        <FormErrors errors={errors} fieldKey="brand">
          <ClientSuspense fallback={<div className="h-9 bg-base-200 skeleton " />}>
          <PBPickRelationField<BrandsRecordBrandsExpand>
            dialogTrigger={
              <span className="btn btn-outline btn-sm">Brand</span>
            }
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

          </ClientSuspense>
        </FormErrors>
        <p className="text-lg">
          {item.expand?.brand.name}
        </p>
        </div>
        <FormErrors errors={errors} fieldKey="variant">
          <ProductVariantField
            variants={input.variant}
            setVariants={(v) => setInput({ ...input, variant: v })}
          />
        </FormErrors>
        <FormErrors errors={errors} fieldKey="description">
          <ProductDescriptionEditor
            description={input.description ?? ""}
            setDescription={(d) => setInput({ ...input, description: d })}
          />
        </FormErrors>
        <GeneralFormError error_message={error_message} />
        <SpinnerButton mutation={mutation} />
      </form>
    </div>
  );
}
