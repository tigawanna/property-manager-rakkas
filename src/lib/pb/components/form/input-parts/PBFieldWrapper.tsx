import type { IUseFormError } from "@/components/form/useForm";
import type{ ClientResponseError } from "pocketbase";

interface PBFieldErrorProps<T> {
  children: React.ReactNode;
  validation_error?: IUseFormError | null;
  pb_error?: ClientResponseError | null;
  error_message?: string;
  field_key: keyof T;
}
interface FieldError {
  message: string;
  code: string;
}
export function PBFieldWrapper<T>({
  children,
  validation_error,
  error_message,
  pb_error,
  field_key,
}: PBFieldErrorProps<T>) {
  const validation_field_error =
  validation_error?.name === field_key ? validation_error.message : undefined;
  const error_data = pb_error?.data?.data;
  const pb_field_error = error_data?.[field_key] as FieldError | undefined;
  const final_error_message = validation_field_error ?? pb_field_error?.message??error_message

    const default_tw_styles = error_message
      ? "  w-full border-error border-2 flex flex-col gap-2"
      : " w-full flex flex-col gap-2 ";

  return (
    <div className={default_tw_styles}>
      {children}
      {error_message && (
        <span className="text-xs italic text-error">{final_error_message}</span>
      )}
    </div>
  );
}
