import { SignInForm } from "./components/SignInForm";
import { type PageProps, Head } from "rakkasjs";

export default function SignInPage({url}: PageProps) {
  return (
    <div className="w-full h-fit flex items-center justify-center">
      <Head
        title="Lavington liquor store | Signin"
        description={"Sign in to your account"}
      />
      <SignInForm current={url} />
    </div>
  );
}
