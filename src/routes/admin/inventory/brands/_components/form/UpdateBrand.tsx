import { useFormHook } from "@/components/form/useForm";
import { sonnerToast } from "@/components/shadcn/misc/sonner-taost";
import type { CollectionName } from "@/lib/pb/client";
import { PbTheTextInput } from "@/lib/pb/components/form/input-parts/PBTheTextInput";
import type {
  LiquorstoreBrandsCollection,
  LiquorstoreBrandsResponse,
  LiquorstoreBrandsUpdate,
  LiquorstoreCategoriesCollection,
  LiquorstoreCategoriesResponse,
} from "@/lib/pb/database";
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
import {
  PBPickRelationField,
  PBPickRelationsModal,
} from "@/lib/pb/components/form/input-parts/PBrelationPicker";

type BrandsRecordCategoryExpand = Pick<
  LiquorstoreCategoriesResponse,
  "id" | "name"
>;

type BrandsRecord = LiquorstoreBrandsUpdate & {
  expand?: {
    category?: BrandsRecordCategoryExpand;
  };
};

interface UpdateBrandProps {
  id: string;
  item: BrandsRecord;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const collectionName: CollectionName = "liquorstore_brands";
export function UpdateBrand({ id, item, setOpen }: UpdateBrandProps) {
  const { pb, viewer } = usePocketbase();
  const { input, handleChange, setInput } =
    useFormHook<LiquorstoreBrandsUpdate>({
      initialValues: {
        name: item.name,
        category: item.category,
      },
    });

  const mutation = useMutation({
    mutationFn: (data: LiquorstoreBrandsUpdate) => {
      return pbTryCatchWrapper(pb.from(collectionName).update(id, data));
    },
    meta: { invalidates: [collectionName] },
    onSuccess: (data) => {
      if (data) {
        if (data.data) {
          sonnerToast({
            type: "success",
            title: "New category added",
          });

          setOpen(false);
        }
        if (data.error) {
          sonnerToast({
            type: "error",
            title: "Something went wrong while creating new category",
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
        title: "Something went wrong while creating new category",
        options: {
          description: error.message,
        },
      });
    },
  });

  const [categories, setCategories] = useState<
    BrandsRecordCategoryExpand[] | undefined
  >(item.expand?.category ? [item.expand?.category] : []);
  const pb_error = mutation.data?.error;
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input.name) {
      mutation.mutate(input);
    }
  }
  // console.log({input})
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <form
        className="w-full h-full flex flex-col gap-5"
        onSubmit={handleSubmit}
      >
        <PbTheTextInput
          field_key={"name"}
          field_name={"Name"}
          onChange={handleChange}
          val={input.name}
          pb_error={pb_error}
        />

        <PBPickRelationField<BrandsRecordCategoryExpand>
          dialogTrigger={
            <span className="btn btn-outline btn-sm">Pick a category</span>
          }
          selectedRows={categories}
          maxSelected={1}
          setSelectedRows={(itm) => {
            if (Array.isArray(itm)) {
              setCategories(itm as any);
              setInput((prev) => ({ ...prev, category: itm.at(-1)?.id }));
            }
          }}
          collectionName="liquorstore_categories"
          columns={{
            name: {
              name: "name",
            },
          }}
          fieldLabel="Category"
          searchParamKey="ths"
          filterBy="name"
        />

        <SpinnerButton mutation={mutation} />
      </form>
    </div>
  );
}

interface UpdateBrandModalProps {
  id: string;
  item: BrandsRecord;
  setOpenDropdown?: React.Dispatch<React.SetStateAction<boolean>>;
}
export function UpdateBrandModal({
  id,
  item,
  setOpenDropdown,
}: UpdateBrandModalProps) {
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
          <DialogTitle>Update Brand</DialogTitle>
          {/* <DialogDescription>Add a project </DialogDescription> */}
        </DialogHeader>
        <div className="w-full h-full ">
          <UpdateBrand id={id} item={item} setOpen={setOpen} />
        </div>

        {/* <DialogFooter className="sm:justify-start"></DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
interface DeleteBrandModalProps {
  id: string;
  setOpenDropdown?: React.Dispatch<React.SetStateAction<boolean>>;
}
export function DeleteBrandModal({
  id,
  setOpenDropdown,
}: DeleteBrandModalProps) {
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
            title: "Category deleted",
          });

          setOpen(false);
        }
        if (data.error) {
          sonnerToast({
            type: "error",
            title: "Something went wrong while deleting new category",
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
        title: "Something went wrong while deleting new category",
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
            Are you sure you want to delete this brand?
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
