import { Button } from "@/components/shadcn/ui/button";
import { Link, navigate, useLocation, usePageContext } from "rakkasjs";
import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { useMutation, useQueryClient } from "rakkasjs";
import { useFormHook } from "@/components/form/useForm";
import { useState } from "react";
import { Loader } from "lucide-react";
import { confirmResetPassword, resetPassword } from "@/lib/pb/auth";
import { toast } from "sonner";

interface PasswordResetFormProps {}

export function PasswordResetForm({}: PasswordResetFormProps) {
  const show_form = true;
  const [show, setShow] = useState(false);
  const [requested, setRequested] = useState(false);
  const { current } = useLocation();
  const page_ctx = usePageContext();
  const requesting_email = current.searchParams.get("email");
  const qc = useQueryClient();

  const { handleChange, input, setError, setInput, validateInputs } =
    useFormHook({
      initialValues: {
        email: requesting_email ?? "",
        token: "",
        password: "",
        passwordConfirm: "",
      },
    });

  const pw_reset_request_mutation = useMutation(
    (vars: { email: string }) => {
      return resetPassword({
        pb: page_ctx.locals.pb,
        email: vars.email,
        collection: "property_user",
      });
    },
    {
      invalidateTags: ["viewer"],
      onError(error: any) {
        toast.error("Something went wrong", {
          description: error?.message,
        });
      },
      onSuccess(data) {
        if (data?.data) {
          toast.success("Success", {
            description: "Password reset request sent, check your email",
          });
          setRequested(true);
        }
        if (data?.error) {
          toast.error("Something went wrong", {
            description: data?.error?.message,
          });
        }
      },
    },
  );
  const pw_reset_confirm_mutation = useMutation(
    (vars: typeof input) => {
      return confirmResetPassword({
        pb: page_ctx.locals.pb,
        collection: "property_user",
        token: vars.token,
        password: vars.password,
        passwordConfirm: vars.passwordConfirm,
      });
    },
    {
      invalidateTags: ["viewer"],
      onSuccess(data) {
        if (data?.data) {
          qc.invalidateQueries(["viewer"]);
          toast.success("Success", {
            description: "Password reset successfully",
          });
          setRequested(false);
          navigate("/auth");
        }
        if (data?.error) {
          toast.error("Something went wrong", {
            description: data?.error?.message,
          });
        }
      },
      onError(error: any) {
        toast.error("Something went wrong", {
          description: error?.message,
        });
      },
    },
  );

  function handleRequestPasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    pw_reset_request_mutation.mutate({ email: input.email });
  }

  function handleConfirmPasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    pw_reset_confirm_mutation.mutate(input);
  }
  return (
    <div className="w-full  h-fit flex flex-col items-center justify-center p-5 gap-5">
      <div className="w-full h-full md:w-[60%] lg:w-[40%] flex flex-col gap-4">
        {!requested && (
          <form
            className="w-full h-full  flex flex-col items-center justify-center gap-4"
            // method="POST"
            onSubmit={handleRequestPasswordChange}
          >
            <h1 className="text-2xl font-bold">Request Password Reset</h1>
            <TheTextInput
              field_key={"email"}
              field_name="Email"
              required
              val={input.email}
              onChange={handleChange}
            />
            <Button
              type="submit"
              disabled={pw_reset_request_mutation.isLoading}
              className="btn btn-sm btn-outline min-w-[50%]"
              variant={"ghost"}
              size={"sm"}
            >
              {" "}
              Submit{" "}
              {pw_reset_request_mutation.isLoading && (
                <Loader className="animate-spin" />
              )}
            </Button>
          </form>
        )}
        {requested && (
          <form
            className="w-full h-full  flex flex-col items-center justify-center gap-4"
            // method="POST"
            onSubmit={handleConfirmPasswordChange}
          >
            <h1 className="text-2xl font-bold">Confirm Password Reset</h1>

            <TheTextInput
              field_key={"token"}
              field_name="Toekn"
              required
              val={input.token}
              onChange={handleChange}
            />

            <TheTextInput
              field_key={"password"}
              field_name="password"
              type={show ? "text" : "password"}
              required
              min={8}
              onChange={handleChange}
              val={input.password}
            />

            <TheTextInput
              field_key={"passwordConfirm"}
              field_name="passwordConfirm"
              type={show ? "text" : "password"}
              required
              min={8}
              onChange={handleChange}
              val={input.passwordConfirm}
            />
            <TheTextInput
              field_key={"show"}
              field_name={"show password"}
              onChange={(e) => setShow(e.target.checked)}
              type="checkbox"
              className="h-5 border-none w-5"
              container_classname="border-none flex flex-row gap-3"
              label_classname="min-w-fit "
            />

            <Button
              type="submit"
              disabled={pw_reset_confirm_mutation.isLoading}
              className="btn btn-sm btn-outline min-w-[50%]"
              variant={"ghost"}
              size={"sm"}
            >
              {" "}
              Submit{" "}
              {pw_reset_confirm_mutation.isLoading && (
                <Loader className="animate-spin" />
              )}
            </Button>
          </form>
        )}
      </div>
      {show_form && (
        <p className=" text-sm">
          Already have an account ?{" "}
          <Link href="/auth" className="text-accent">
            Log in
          </Link>
        </p>
      )}
    </div>
  );
}
