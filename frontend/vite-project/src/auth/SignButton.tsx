import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const SignButton = () => {
  return (
    <div>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton forceRedirectUrl="/authentication" />
        </SignedOut>
    </div>
  );
};

export default SignButton;
