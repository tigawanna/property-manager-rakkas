import { useFormHook } from "@/components/form/useForm";
import { sonnerToast } from "@/components/shadcn/misc/sonner-taost";
import type { CollectionName } from "@/lib/pb/client";
import { PbTheTextInput } from "@/lib/pb/components/form/input-parts/PBTheTextInput";
import type {
  PropertyShopsCreate,
  PropertyTenantsResponse,
} from "@/lib/pb/database";
import { usePocketbase } from "@/lib/pb/hooks/use-pb";
import { pbTryCatchWrapper } from "@/lib/pb/utils";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SpinnerButton } from "@/lib/tanstack/components/SpinnerButton";
import { PBPickRelationField } from "@/lib/pb/components/form/input-parts/PBrelationPicker";
import { PropertyFloorPrefixes } from "./floors";
import { ShopNumberInput } from "./ShopNumberInput";
type PropertyTenantsExpand = Pick<PropertyTenantsResponse, "id" | "username">;
interface CreateBrandProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateBrand({ setOpen }: CreateBrandProps) {
  const collectionName: CollectionName = "property_shops";
  const [categories, setCategories] = useState<
    PropertyTenantsExpand[] | undefined
  >([]);
  const { pb, viewer } = usePocketbase();
  const { input, handleChange, setInput } = useFormHook<
    PropertyShopsCreate & { floor: PropertyFloorPrefixes }
  >({
    initialValues: {
      shop_number: "",
      floor:"G",
      is_vacant: false,
      order: 0,
      tenant: "",
      utils: "none",
    },
  });
  const mutation = useMutation({
    mutationFn: (data: PropertyShopsCreate) => {
      return pbTryCatchWrapper(pb.from(collectionName).create(data));
    },
    meta: { invalidates: [collectionName] },
    onSuccess: (data) => {
      if (data) {
        if (data.data) {
          sonnerToast({
            type: "success",
            title: "New Shop added",
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
    mutation.mutate(input);
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <form className="size-full flex flex-col gap-5" onSubmit={handleSubmit}>
        <ShopNumberInput input={input} setInput={setInput} />
        <PbTheTextInput<typeof input>
          field_key={"shop_number"}
          field_name={"Shop Number"}
          onChange={handleChange}
          val={input.shop_number}
          pb_error={pb_error}
        />
        <PBPickRelationField<PropertyTenantsExpand>
          dialogTrigger={
            <span className="btn btn-outline btn-sm">Pick a category</span>
          }
          selectedRows={categories}
          maxSelected={1}
          setSelectedRows={(itm) => {
            if (Array.isArray(itm)) {
              setCategories(itm as any);
              setInput((prev) => ({ ...prev, category: itm.at(-1)?.id ?? "" }));
            }
          }}
          collectionName="property_tenants"
          columns={{
            username: {
              name: "tenant",
            },
  
          }}
          fieldLabel="Tenant"
          searchParamKey="ths"
          filterBy="username"
        />
        <SpinnerButton mutation={mutation} />
      </form>
    </div>
  );
}

interface CreateBrandModalProps {}
export function CreateBrandModal({}: CreateBrandModalProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        asChild
        className="flex justify-center items-center size-full"
      >
        <Plus className="" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[80%] min-w-[80%] md:min-w-[60%] lg:min-w-[40%] w-fit min-h-[30%]overflow-auto">
        <DialogHeader>
          <DialogTitle>Add new Brand</DialogTitle>
          {/* <DialogDescription>Add a project </DialogDescription> */}
        </DialogHeader>

        <div className="w-full h-full ">
          <CreateBrand setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
