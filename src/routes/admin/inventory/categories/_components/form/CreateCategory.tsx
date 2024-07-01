import { useFormHook } from "@/components/form/useForm";
import { sonnerToast } from "@/components/shadcn/misc/sonner-taost";
import type { CollectionName } from "@/lib/pb/client";
import { PbTheTextInput } from "@/lib/pb/components/form/input-parts/PBTheTextInput";
import type { LiquorstoreCategoriesCreate } from "@/lib/pb/database";
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
interface CreateCategoryProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateCategory({ setOpen }: CreateCategoryProps) {
  const collectionName: CollectionName = "liquorstore_categories";
  const { pb, viewer } = usePocketbase();
  const { input, handleChange, setInput } =
    useFormHook<LiquorstoreCategoriesCreate>({
      initialValues: {
        name: "",
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
  const pb_error = mutation.data?.error;
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input.name) {
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
        <SpinnerButton mutation={mutation} />
      </form>
    </div>
  );
}

interface CreateCategoryModalProps {}
export function CreateCategoryModal({}: CreateCategoryModalProps) {
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
          <CreateCategory setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
