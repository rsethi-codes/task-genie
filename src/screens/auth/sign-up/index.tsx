import { clerkAppearance } from "@/lib/clerk/clerk-theme";
import { SignUp } from "@clerk/nextjs";

const SignUpScreen = () => {
  return <SignUp appearance={clerkAppearance} fallbackRedirectUrl={'/dashboard'} />;
};

export default SignUpScreen;
