import CenteredCoverScreen from "@/components/common/centered-screen-cover";
import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-theme";

export default function SignUpPage() {
  return (
    <CenteredCoverScreen>
      <SignUp appearance={clerkAppearance} />
    </CenteredCoverScreen>
  );
}
