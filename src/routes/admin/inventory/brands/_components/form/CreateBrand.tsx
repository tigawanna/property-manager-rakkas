import { useFormHook } from "@/components/form/useForm";
import { sonnerToast } from "@/components/shadcn/misc/sonner-taost";
import type { CollectionName } from "@/lib/pb/client";
import { PbTheTextInput } from "@/lib/pb/components/form/input-parts/PBTheTextInput";
import type {
  LiquorstoreBrandsCreate,
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
  DialogTrigger,
} from "@/components/shadcn/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SpinnerButton } from "@/lib/tanstack/components/SpinnerButton";
import { PBPickRelationField } from "@/lib/pb/components/form/input-parts/PBrelationPicker";
type BrandsRecordCategoryExpand = Pick<
  LiquorstoreCategoriesResponse,
  "id" | "name"
>;
interface CreateBrandProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateBrand({ setOpen }: CreateBrandProps) {
  
  const collectionName: CollectionName = "liquorstore_brands";
  const [categories, setCategories] = useState<
    BrandsRecordCategoryExpand[] | undefined
  >([]);
  const { pb, viewer } = usePocketbase();
  const { input, handleChange, setInput } =
    useFormHook<LiquorstoreBrandsCreate>({
      initialValues: {
        name: "",
        category: "",
      },
    });
  const mutation = useMutation({
    mutationFn: (data: LiquorstoreBrandsCreate) => {
      return pbTryCatchWrapper(pb.from(collectionName).create(data));
    },
    meta: { invalidates: [collectionName] },
    onSuccess: (data) => {
      if (data) {
        if (data.data) {
          sonnerToast({
            type: "success",
            title: "New Brand added",
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
  const error_message = mutation.error?.message??pb_error?.message
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input.name && input.category!=="") {
      mutation.mutate(input);
    }
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <form className="size-full flex flex-col gap-5" onSubmit={handleSubmit}>
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
              setInput((prev) => ({ ...prev, category: itm.at(-1)?.id??"" }));
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
