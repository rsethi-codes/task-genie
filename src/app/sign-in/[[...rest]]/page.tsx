import CenteredCoverScreen from "@/components/common/centered-screen-cover";
import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk/clerk-theme";

export default function SignUpPage() {
  return (
    <CenteredCoverScreen>
      <SignIn
        appearance={clerkAppearance}
        // ! below is the redirect URL after a successful SIGN IN, this is to redirect user to the dashboard
        // fallbackRedirectUrl={'/dashboard'}
      />
    </CenteredCoverScreen>
  );
}
