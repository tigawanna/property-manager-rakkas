import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { IUseFormError } from "@/components/form/useForm";
import { ClientResponseError } from "pocketbase";
import { twMerge } from "tailwind-merge";

interface PBTheImageURLInputProps<T>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  field_name: React.ReactNode;
  field_key: keyof T;
  error_message?: string;
  container_classname?: string;
  label_classname?: string;
  img_classname?: string;
  description_classname?: string;
  output_classname?: string;
  editing?: boolean;
  description?: string;
  val?: string | Date | URL | number | readonly string[] | undefined;
  validation_error?: IUseFormError | null;
  pb_error?: ClientResponseError | null;
  show_preview?: boolean;
}
interface FieldError {
  message: string;
  code: string;
}

export function PBTheImageURLInput<T>({
  field_name,
  field_key,
  editing = true,
  validation_error,
  className,
  pb_error,
  show_preview=true,
  ...props
}: PBTheImageURLInputProps<T>) {
  const validation_field_error =
    validation_error?.name === field_key ? validation_error.message : undefined;
  const error_data = pb_error?.data?.data;
  const pb_field_error = error_data?.[field_key] as FieldError | undefined;
  const input_value = props.val ?? props.value;
  return (
    <div className="w-full flex flex-col gap-1">
      {input_value && typeof input_value ==="string" && show_preview? (
        <div className="flex justify-center items-center">
          <img
            className={twMerge("rounded-lg h-44 aspect-square w-auto", props.img_classname)}
            src={input_value}
            height={"300"}
            width={"400"}
          />
        </div>
      ) : null}
      <TheTextInput
        {...props}
        className={className}
        field_key={field_key}
        field_name={field_name}
        editing={editing}
        val={props.val ?? props.value}
        error_message={validation_field_error ?? pb_field_error?.message}
      />
    </div>
  );
}
