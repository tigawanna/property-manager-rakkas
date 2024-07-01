import { useFormHook } from "@/components/form/useForm";
import { sonnerToast } from "@/components/shadcn/misc/sonner-taost";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/ui/dialog";
import type { CollectionName } from "@/lib/pb/client";
import type {
  LiquorstoreCategoriesCreate,
  LiquorstoreProductsInventoryCreate,
  LiquorstoreProductsResponse,
  LiquorstoreUserResponse,
} from "@/lib/pb/database";
import { usePocketbase } from "@/lib/pb/hooks/use-pb";
import { pbTryCatchWrapper } from "@/lib/pb/utils";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { PbTheTextInput } from "@/lib/pb/components/form/input-parts/PBTheTextInput";
import { SpinnerButton } from "@/lib/tanstack/components/SpinnerButton";
import { PBPickRelationField } from "@/lib/pb/components/form/input-parts/PBrelationPicker";

interface CreateInventoryProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
type LiquorstoreProductsExpand = Pick<
  LiquorstoreProductsResponse,
  "id" | "name"
>;
type LiquorstoreUserExpand = Pick<LiquorstoreUserResponse, "id" | "name">;
const collectionName: CollectionName = "liquorstore_products_inventory";

export function CreateInventory({ setOpen }: CreateInventoryProps) {
  const { pb, viewer } = usePocketbase();
  const [products, setProducts] = useState<
    LiquorstoreProductsExpand[] | undefined
  >([]);
  const [by, setBy] = useState<LiquorstoreUserExpand[] | undefined>([]);
  const { input, handleChange, setInput, validateInputs, setErrors } =
    useFormHook<LiquorstoreProductsInventoryCreate>({
      initialValues: {
        quantity: 0,
        size: 0,
        product: "",
        by: viewer?.id ?? "",
        price: 100,
      },
    });
  const mutation = useMutation({
    mutationFn: (data: LiquorstoreCategoriesCreate) => {
      return pbTryCatchWrapper(pb.from(collectionName).create(data));
    },
    meta: { invalidates: [collectionName] },
    onSuccess: (data) => {
      if (data) {
        if (data.data) {
          sonnerToast({
            type: "success",
            title: "New inventory entry added",
          });

          setOpen(false);
        }
        if (data.error) {
          sonnerToast({
            type: "error",
            title: "Something went wrong while creating new iventory entry",
            options: {
              description: data.error.message,
            },
          });
        }
      }
    },
    onError: (error: any) => {
      sonnerToast({
        type: "error",
        title: "Something went wrong while creating new iventory entry",
        options: {
          description: error.message,
        },
      });
    },
  });
  const pb_error = mutation.data?.error;
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const isValid = validateInputs((ipt) => {
      if (ipt?.by && ipt?.by.length < 1) {
        setErrors((prev) => {
          return {
            ...prev,
            by: { name: "by", message: "Size should be atleast 100ml" },
          };
        });
        return false;
      }
      if (ipt?.size && ipt?.size < 100) {
        // @ts-expect-error
        setErrors((prev) => {
          return {
            ...prev,
            size: { name: "size", message: "Size should be atleast 100ml" },
          };
        });
        return false;
      }
      return true;
    });
    if (isValid) {
      mutation.mutate(input);
    }
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <form className="size-full flex flex-col gap-5" onSubmit={handleSubmit}>
        <PbTheTextInput<LiquorstoreProductsInventoryCreate>
          field_key={"size"}
          field_name={"Size"}
          onChange={handleChange}
          val={input.size}
          type="number"
          pb_error={pb_error}
        />
        <PbTheTextInput<LiquorstoreProductsInventoryCreate>
          field_key={"quantity"}
          field_name={"Quantity"}
          onChange={handleChange}
          val={input.quantity}
          type="number"
          pb_error={pb_error}
        />

        <PBPickRelationField<LiquorstoreProductsExpand>
          dialogTrigger={
            <span className="btn btn-outline btn-sm">Product</span>
          }
          selectedRows={products}
          maxSelected={1}
          setSelectedRows={(itm) => {
            if (Array.isArray(itm)) {
              setProducts(itm as any);
              setInput((prev) => ({ ...prev, brand: itm.at(-1)?.id ?? "" }));
            }
          }}
          collectionName="liquorstore_products"
          columns={{
            name: {
              name: "name",
            },
          }}
          fieldLabel="Products"
          searchParamKey="invp"
          filterBy="name"
        />
        <SpinnerButton mutation={mutation} />
      </form>
    </div>
  );
}

interface CreateInvemtoryModalProps {}

export function CreateInvemtoryModal({}: CreateInvemtoryModalProps) {
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
          <DialogTitle>Add new Category</DialogTitle>
          {/* <DialogDescription>Add a project </DialogDescription> */}
        </DialogHeader>

        <div className="w-full h-full ">
          <CreateInventory setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
