import { OAuthproviders } from "./OAuthProviders";
import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { useFormHook } from "@/components/form/useForm";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { emailPasswordLogin, resetPassword } from "@/lib/pb/auth";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import { Label } from "@/components/shadcn/ui/label";
import { usePageContext, navigate, Link } from "rakkasjs";
import { sonnerToast } from "@/components/shadcn/misc/sonner-taost";
import { type TSigninformSchema, signinformSchema } from "./schema.auth";
import { SpinnerButton } from "@/lib/tanstack/components/SpinnerButton";

interface SignInFormProps {
  current: URL;
}

export function SignInForm({ current }: SignInFormProps) {
  const page_ctx = usePageContext();
  const [show, setShow] = useState(false);

  const { handleChange, input, setError, setInput, validateInputs } =
    useFormHook<TSigninformSchema>({
      initialValues: {
        password: "",
        usernameOrEmail: "",
      },
    });

  const email_login_mutation = useMutation({
    mutationFn: (vars: { usernameOrEmail: string; password: string }) => {
      return emailPasswordLogin({
        pb: page_ctx.locals.pb,
        collection: "liquorstore_user",
        identity: vars.usernameOrEmail,
        password: vars.password,
      });
    },
    meta: {
      invalidates: ["viewer"],
    },
    onSuccess(data) {
      if (data?.data) {
        // qc.invalidateQueries({ queryKey: ["viewer"] });
        const return_to = current.searchParams.get("return_to");
        navigate(return_to ?? "/");
        sonnerToast({
          title: "welcome",
          options: {
            description: `${data?.data?.record?.username}`,
          },
        });
      }
      if (data?.error) {
        console.log(" === data === ", data.error.message);
        sonnerToast({
          type: "error",
          options: {
            description: `${data?.error?.message}`,
          },
        });
      }
    },
    onError(error: any) {
      sonnerToast({
        type: "error",
        options: {
          description: error?.message,
        },
      });
    },
  });

  const pw_reset_request_mutation = useMutation({
    mutationFn: (vars: { email: string }) => {
      return resetPassword({
        pb: page_ctx.locals.pb,
        email: vars.email,
        collection: "liquorstore_user",
      });
    },
    meta: {
      invalidates: ["viewer"],
    },
    onError(error: any) {
      sonnerToast({
        type: "error",
        options: {
          description: error?.message,
        },
      });
    },
    onSuccess(data) {
      if (data?.data) {
        sonnerToast({
          title: "success",
          options: {
            description: "Password reset request sent, check your email",
          },
        });
      }
      if (data?.error) {
        sonnerToast({
          type: "error",
          options: {
            description: data?.error?.message,
          },
        });
      }
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    email_login_mutation.mutate(signinformSchema.parse(input));
  }

  return (
    <div className="w-full h-fit flex flex-col items-center justify-center p-5 gap-5">
      <div className="w-full h-full md:w-[60%] lg:w-[40%] flex flex-col gap-5">
        <h1 className="text-3xl font-bold">Sign In</h1>

        <form
          className="w-full h-full  flex flex-col items-center justify-center gap-4"
          onSubmit={handleSubmit}
        >
          <TheTextInput
            field_key={"usernameOrEmail"}
            field_name="usernameOrEmail"
            onChange={handleChange}
            required
            val={input.usernameOrEmail}
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

          <SpinnerButton type="submit" mutation={email_login_mutation} label="Sign In"/>
          {email_login_mutation.data?.error && (
            <div className="w-full flex justify-center">
              <p className="bg-error-content text-error text-sm p-2 rounded-e-lg ">
                {email_login_mutation.data.error?.message}
              </p>
            </div>
          )}
          {pw_reset_request_mutation.data?.error && (
            <div className="w-full flex justify-center">
              <p className="bg-error-content text-error text-sm p-2 rounded-e-lg ">
                {pw_reset_request_mutation.data.error?.message}
              </p>
            </div>
          )}
        </form>

        <div className="w-full flex items-center justify-center">
          <span className="w-full border-t" />
          <span className="px-2 text-muted-foreground min-w-fit">
            Or continue with
          </span>
          <span className="w-full border-t" />
        </div>

        <OAuthproviders />
      </div>

      <div className="flex flex-col gap-2">
        <p className=" ">
          New here ? Create an account ?{" "}
          <Link href="/auth/signup" className="text-accent">
            Sign up
          </Link>
        </p>
        <SpinnerButton
          type="submit"
          label="Reset password"
          onClick={() =>
            pw_reset_request_mutation.mutate({
              email: input.usernameOrEmail,
            })
          }
          mutation={pw_reset_request_mutation}
        />
      </div>
    </div>
  );
}
