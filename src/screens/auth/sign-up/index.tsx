import { clerkAppearance } from "@/lib/clerk/clerk-theme";
import { SignUp } from "@clerk/nextjs";

const SignUpScreen = () => {
  return <SignUp appearance={clerkAppearance} />;
};

export default SignUpScreen;
