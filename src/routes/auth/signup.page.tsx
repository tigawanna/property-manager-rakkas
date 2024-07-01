import { Head, type PageProps } from "rakkasjs";
import { SignUpForm } from "./components/SignUpForm";

export default function SignupPage({}: PageProps) {
  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center">
      <Head
        title="Lavington liquor store | Signup"
        description={"Create your account"}
      />
      <SignUpForm />
    </div>
  );
}
