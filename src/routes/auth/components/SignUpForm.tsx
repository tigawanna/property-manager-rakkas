import { Button } from "@/components/shadcn/ui/button";
import { OAuthproviders } from "./OAuthProviders";
import { Link, navigate, useLocation, usePageContext } from "rakkasjs";
import { useMutation, useQueryClient } from "rakkasjs";
import { useFormHook } from "@/components/form/useForm";
import { useState } from "react";
import { PbTheTextInput } from "@/lib/pb/components/form/input-parts/PBTheTextInput";
import { createUser } from "@/lib/pb/auth";
import { toast } from "sonner";
import { Label } from "@/components/shadcn/ui/label";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import { type TSignupformSchema, signupformSchema } from "./schema.auth";
import { SpinnerButton } from "@/lib/tanstack/components/SpinnerButton";
interface SignupFormProps {}

export function SignUpForm({}: SignupFormProps) {
  const [show, setShow] = useState(false);
  const page_ctx = usePageContext();
  const { current } = useLocation();
  const qc = useQueryClient();

  const { handleChange, input, error, setError, setInput, validateInputs } =
    useFormHook<TSignupformSchema>({
      initialValues: {
        email: "",
        username: "",
        name: "",
        password: "",
        passwordConfirm: "",
      },
    });

  const email_password_signup_mutation = useMutation(
    (vars: typeof input) => {
      return createUser({
        pb: page_ctx.locals.pb,
        collection: "property_user",
        data: {...vars,role:"user"},
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
          qc.invalidateQueries(["viewer"]);
          // console.log({ data });
          toast.success("Welcome", {
            description: `${data?.data?.record?.username}`,
          });
          //  const return_to = current.searchParams.get("return_to");
          navigate("/auth");
        }
        if (data?.error) {
          toast.error("Something went wrong", {
            description: data?.error?.message,
          });
        }
      },
    },
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const is_valid = validateInputs((ipt) => {
      if (ipt.password !== ipt.passwordConfirm) {
        setError({
          name: "passwordConfirm",
          message: "passwords do not match",
        });
        return false;
      }
      return true;
    });
    e.preventDefault();
    if (is_valid) {
      email_password_signup_mutation.mutate(signupformSchema.parse(input));
    }
    // mutation.mutate(input);
  }
  return (
    <div className="w-full  h-fit flex flex-col items-center justify-center p-5 pb-5 gap-5">
      <div className="w-full h-full md:w-[60%] lg:w-[40%] flex flex-col gap-5">
        <h1 className="text-3xl font-bold">Sign Up</h1>

        <form
          className="w-full h-full  flex flex-col items-center justify-center gap-4"
          // method="POST"
          onSubmit={handleSubmit}
        >
          <PbTheTextInput
            field_key={"email"}
            field_name="Email"
            required
            val={input.email}
            onChange={handleChange}
            validation_error={error}
            pb_error={email_password_signup_mutation.data?.error}
          />
          <PbTheTextInput
            field_key={"username"}
            field_name="Username"
            required
            min={4}
            val={input.username}
            onChange={handleChange}
            validation_error={error}
            pb_error={email_password_signup_mutation.data?.error}
          />
          <PbTheTextInput
            field_key={"password"}
            field_name="password"
            type={show ? "text" : "password"}
            required
            min={8}
            onChange={handleChange}
            val={input.password}
            validation_error={error}
            pb_error={email_password_signup_mutation.data?.error}
          />
          <PbTheTextInput
            field_key={"passwordConfirm"}
            field_name="passwordConfirm"
            type={show ? "text" : "password"}
            required
            min={8}
            onChange={handleChange}
            val={input.passwordConfirm}
            validation_error={error}
            pb_error={email_password_signup_mutation.data?.error}
          />
          <div className="flex gap-2 items-center justify-center">
            <Label htmlFor="show-password">show password</Label>
            <Checkbox
              id="show-password"
              name="show-password"
              className="h-5 w-5"
              checked={show}
              onCheckedChange={(e) => {
                e.valueOf() ? setShow(true) : setShow(false);
              }}
            />
          </div>

          <SpinnerButton
            type="submit"
            label="Sign Up"
            // @ts-expect-error
            mutation={email_password_signup_mutation}
          />
        </form>

        {email_password_signup_mutation.data?.error && (
          <div className="w-full flex justify-center">
            <p className="bg-error-content text-error text-sm p-2 rounded-e-lg ">
              {email_password_signup_mutation.data.error?.message}
            </p>
          </div>
        )}

        <div className="w-full flex items-center justify-center">
          <span className="w-full border-t" />
          <span className="bg-background px-2 text-muted-foreground min-w-fit">
            Or continue with
          </span>
          <span className="w-full border-t" />
        </div>

        <OAuthproviders />
      </div>

      <p className=" text-sm pb-5">
        Already have an account ?{" "}
        <Link href="/auth" className="text-accent">
          Log in
        </Link>
      </p>
    </div>
  );
}
