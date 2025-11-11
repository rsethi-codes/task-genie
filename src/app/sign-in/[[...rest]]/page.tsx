import CenteredCoverScreen from "@/components/common/centered-screen-cover";
import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-theme";

export default function SignUpPage() {
  return (
    <CenteredCoverScreen>
      <SignIn appearance={clerkAppearance} />
    </CenteredCoverScreen>
  );
}
