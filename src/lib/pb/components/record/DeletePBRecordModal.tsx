import { usePocketbase } from "@/lib/pb/hooks/use-pb";
import { pbTryCatchWrapper } from "@/lib/pb/utils";
import { useMutation } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { Button } from "@/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/ui/dialog";
import { useState } from "react";
import { CollectionName } from "@/lib/pb/client";
import { sonnerToast } from "@/components/shadcn/misc/sonner-taost";
import { SpinnerButton } from "@/lib/tanstack/components/SpinnerButton";

interface DeletePBRecordModalProps {
  id: string;
  label: string;
  triggerLabel?: React.ReactNode;
  setOpenDropdown?: React.Dispatch<React.SetStateAction<boolean>>;
  collectionName: CollectionName;
}

export function DeletePBRecordModal({
  id,
  label,
  triggerLabel,
  setOpenDropdown,
  collectionName,
}: DeletePBRecordModalProps) {
  const [open, setOpen] = useState(false);
  const { pb } = usePocketbase();
  const mutation = useMutation({
    mutationFn: () => {
      return pbTryCatchWrapper(pb.from(collectionName).delete(id));
    },
    meta: {
      invalidates: [collectionName],
    },
    onSuccess: (data) => {
      if (data) {
        if (data.data) {
          sonnerToast({
            type: "success",
            title: "Succesfully deleted",
          });

          setOpen(false);
        }
        if (data.error) {
          sonnerToast({
            type: "error",
            title: "Something went wrong while deleting",
            options: {
              description: data.error.message,
            },
          });
        }
      }
    },
    onError: (error) => {
      sonnerToast({
        type: "error",
        title: "Something went wrong while deleting",
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
        setOpenDropdown && setOpenDropdown?.(open);
      }}
    >
      <DialogTrigger asChild>
        <div className="flex gap-2">
          <Trash className="text-error fill-error" />
          {triggerLabel}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[80%] w-fit min-w-[40%] px-4 py-2 h-fit overflow-auto">
        <DialogHeader>
          <DialogTitle>Delete entry</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete ?{" "}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full h-full flex justify-between items-center gap-6">
          <SpinnerButton
            type="button"
            variant="destructive"
            label="Delete"
            mutation={mutation}
            onClick={() => {
              mutation.mutate();
            }}
          />
          <Button
            className="min-w-[40%]"
            type="button"
            variant="outline"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <div className="flex justify-center items-center   gap-3"></div>
        </div>

        <DialogFooter className="sm:justify-start"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
