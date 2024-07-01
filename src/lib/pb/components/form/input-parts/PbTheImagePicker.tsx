import { useRef, useState } from "react";
import { getFileURL } from "@/lib/pb/client";
import { ImagePlus } from "lucide-react";
import { twMerge } from "tailwind-merge";
import type { Schema } from "@/lib/pb/database";

interface PbTheImagePickerProps {
  field_name: React.ReactNode;
  show_preview?: boolean;
  label_classname?: string;
  img_classname?: string;
  collection_id_or_name?: keyof Schema;
  record_id?: string;
  file_name?: string;
  setFileImage?: (file: File | null) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export function PBTheImagePicker({
  field_name,
  label_classname,
  img_classname,
  show_preview = true,
  collection_id_or_name,
  record_id,
  file_name,
  setFileImage,
  inputProps,
}: PbTheImagePickerProps) {
  const img_url = getFileURL({ collection_id_or_name, record_id, file_name });

  const [pic, setPic] = useState(img_url);
  //  const [input_pic, setInputPic] = useState<File | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      //   setInputPic(e.target.files[0]);
      setPic((prev) => {
        if (e.target.files?.[0]) {
          return URL.createObjectURL(e.target.files[0]);
        }
        return prev;
      });
      setFileImage?.(e.target.files?.[0]);
    }
  }
  return (
    <div className="w-full  flex flex-col justify-center gap-1 relative min-h-24 p-2 rounded-md">
      <div
        className={twMerge("font-serif text-sm font-semibold", label_classname)}
      >
        {" "}
        {field_name}
      </div>

      {/* <h2 className="text-sm text-accent">{label}</h2> */}
      <div className="w-full  flex  justify-center bg-base-200/70 p-3">
        {typeof pic === "string" && pic.length > 0 && show_preview ? (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div className="" onClick={() => ref.current?.click()}>
            <div className="w-full">
              <img
                className={twMerge(
                  "w-auto h-[200px]  object-cover",
                  img_classname,
                )}
                alt="product visual"
                src={pic}
                height={"200"}
                width={"400"}
              />
            </div>
          </div>
        ) : null}

        <div className="flex flex-col items-center justify-center absolute top-[50%]  bg-base-300/50 p-3 rounded-lg">
          <input
            id="image_picket"
            type="file"
            ref={ref}
            className="hidden"
            onChange={(e) => handleChange(e)}
            {...inputProps}
          />
          <ImagePlus onClick={() => ref.current?.click()} className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}
