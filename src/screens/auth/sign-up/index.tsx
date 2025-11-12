import { clerkAppearance } from "@/lib/clerk/clerk-theme";
import { SignUp } from "@clerk/nextjs";

const SignUpScreen = () => {
  return <SignUp appearance={clerkAppearance}
  // * below is the redirect URL after a successful SIGN UP, this is to redirect user to the dashboard
  // fallbackRedirectUrl={'/dashboard'} 
  />;
};

export default SignUpScreen;
