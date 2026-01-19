import CenteredCoverScreen from "@/components/common/centered-screen-cover";
import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk/clerk-theme";

export default function SignInPage() {
  return (
    <CenteredCoverScreen>
      <SignIn
        appearance={clerkAppearance}
        fallbackRedirectUrl={'/dashboard'}
      />
    </CenteredCoverScreen>
  );
}
