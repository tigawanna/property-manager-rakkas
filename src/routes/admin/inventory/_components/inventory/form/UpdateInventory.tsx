import { useFormHook } from "@/components/form/useForm";
import { sonnerToast } from "@/components/shadcn/misc/sonner-taost";
import type { CollectionName } from "@/lib/pb/client";
import type { LiquorstoreProductsInventoryUpdate, LiquorstoreProductsResponse } from "@/lib/pb/database";
import { usePocketbase } from "@/lib/pb/hooks/use-pb";
import { pbTryCatchWrapper } from "@/lib/pb/utils";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/shadcn/ui/dialog";
import { useState } from "react";
import { Delete, Edit, Trash } from "lucide-react";
import { SpinnerButton } from "@/lib/tanstack/components/SpinnerButton";
import { PbTheTextInput } from "@/lib/pb/components/form/input-parts/PBTheTextInput";
import { PBPickRelationField } from "@/lib/pb/components/form/input-parts/PBrelationPicker";

interface UpdateInventoryProps {
  id: string;
  item: LiquorstoreProductsInventoryUpdate;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const collectionName: CollectionName = "liquorstore_products_inventory";
type LiquorstoreProductsExpand = Pick<
  LiquorstoreProductsResponse,
  "id" | "name"
>;
export function UpdateInventory({ id, item, setOpen }: UpdateInventoryProps) {
  const { pb, viewer } = usePocketbase();
    const [products, setProducts] = useState<
      LiquorstoreProductsExpand[] | undefined
    >([]);
  const { input, handleChange, setInput } =
    useFormHook<LiquorstoreProductsInventoryUpdate>({
      initialValues: {
        quantity: item.quantity,
        size: item.size,
        product: item.product,
      },
    });
  const mutation = useMutation({
    mutationFn: (data: LiquorstoreProductsInventoryUpdate) => {
      return pbTryCatchWrapper(pb.from(collectionName).update(id, data));
    },
    meta: { invalidates: [collectionName] },
    onSuccess: (data) => {
      if (data) {
        if (data.data) {
          sonnerToast({
            type: "success",
            title: "Inventory entry updated",
          });

          setOpen(false);
        }
        if (data.error) {
          sonnerToast({
            type: "error",
            title: "Something went wrong while updating inventory entry",
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
        title: "Something went wrong while updating inventory entry",
        options: {
          description: error.message,
        },
      });
    },
  });
  const pb_error = mutation.data?.error;
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input) {
      mutation.mutate(input);
    }
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <form
        className="w-full h-full flex flex-col gap-5"
        onSubmit={handleSubmit}
      >
        <PbTheTextInput<LiquorstoreProductsInventoryUpdate>
          field_key={"size"}
          field_name={"Size"}
          onChange={handleChange}
          val={input.size}
          type="number"
          pb_error={pb_error}
        />
        <PbTheTextInput<LiquorstoreProductsInventoryUpdate>
          field_key={"quantity"}
          field_name={"Quantity"}
          onChange={handleChange}
          val={input.quantity}
          type="number"
          pb_error={pb_error}
        />

        <PBPickRelationField<LiquorstoreProductsExpand>
          dialogTrigger={<span className="btn btn-outline btn-sm">Product</span>}
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
interface UpdateInventoryModalProps {
  id: string;
  item: LiquorstoreProductsInventoryUpdate;
  setOpenDropdown?: React.Dispatch<React.SetStateAction<boolean>>;
}
export function UpdateInventoryModal({
  id,
  item,
  setOpenDropdown,
}: UpdateInventoryModalProps) {
    const [open, setOpen] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setOpenDropdown?.(open);
      }}
    >
      <DialogTrigger asChild>
        <div className="flex gap-2">
          <Edit className="size-5" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[80%] min-w-[80%] md:min-w-[60%] lg:min-w-[40%] w-fit  overflow-auto">
        <DialogHeader className="">
          <DialogTitle>Update Inventory</DialogTitle>
          {/* <DialogDescription>Add a project </DialogDescription> */}
        </DialogHeader>
        <div className="w-full h-full ">
          <UpdateInventory id={id} item={item} setOpen={setOpen} />
        </div>

        {/* <DialogFooter className="sm:justify-start"></DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
interface DeleteInventoryModaProps {
  id: string;
  setOpenDropdown?: React.Dispatch<React.SetStateAction<boolean>>;
}
export function DeleteInventoryModal({
  id,
  setOpenDropdown,
}: DeleteInventoryModaProps) {
  const [open, setOpen] = useState(false);
  const { pb } = usePocketbase();
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return pbTryCatchWrapper(pb.from(collectionName).delete(id));
    },
    meta: { invalidates: [collectionName] },
    onSuccess: (data) => {
      if (data) {
        if (data.data) {
          sonnerToast({
            type: "success",
            title: "Inventory entry deleted",
          });

          setOpen(false);
        }
        if (data.error) {
          sonnerToast({
            type: "error",
            title: "Something went wrong while deleting new inventory entry",
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
        title: "Something went wrong while deleting new inventory entry",
        options: {
          description: error.message,
        },
      });
    },
  });
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setOpenDropdown?.(open);
      }}
    >
      <DialogTrigger asChild>
        <div className="flex gap-2">
          <Trash className="size-5 hover:fill-error" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[80%] min-w-[80%] md:min-w-[60%] lg:min-w-[40%] w-fit  overflow-auto justify-center">
        <DialogHeader className="px-5">
          <DialogTitle className="text-xl ">
            Are you sure you want to delete this inventory entry?
          </DialogTitle>
          {/* <DialogDescription>Add a project </DialogDescription> */}
        </DialogHeader>
        <div className="w-full h-full px-5">
          <div className="w-full flex gap-2 items-center justify-center ">
            <SpinnerButton
              onClick={() => mutation.mutate(id)}
              mutation={mutation}
              type="button"
              label={
                <div className="flex w-full h-full gap-2 items-center justify-center">
                  <Trash /> delete
                </div>
              }
            />
            <DialogClose className="min-w-[80%] border p-2 rounded-md bg-error md:min-w-[50%] flex gap-2 justify-center font-bold items-center">
              Cancel
            </DialogClose>
          </div>
        </div>

        {/* <DialogFooter className="sm:justify-start"></DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
