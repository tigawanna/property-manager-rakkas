import { ClientSuspense } from "rakkasjs";
import { lazy } from "react";
const RichTextEditor = lazy(
  () => import("@/components/editor/toast/MyToastUiEditor"),
);
interface ProductDescriptionEditorProps {
  description: string;
  setDescription: (description: string) => void;
}

export function ProductDescriptionEditor({
  description,
  setDescription,
}: ProductDescriptionEditorProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <ClientSuspense
        fallback={<div className="w-full h-[600px] bg-base-300 skeleton" />}
      >
        <div className="w-full flex flex-col gap-1 ">
          <p className="font-serif font-semibold">Description</p>
          <RichTextEditor
            initialEditType="wysiwyg"
            theme=""
            initialValue={description}
            onChange={setDescription}
          />
        </div>
      </ClientSuspense>
    </div>
  );
}
