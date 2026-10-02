import { SignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const LoginPage = () => {
  return (
    <div className="relative min-h-screen bg-white dark:white">
      {/* App heading outside the box, larger and positioned slightly above the box */}
      <h1 className="absolute top-50 left-0 right-0 text-center text-9xl font-bold text-white py-4">
        Collaborative Budget Management App
      </h1>

      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            Welcome Back!
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Sign in to continue
          </p>

          <Separator className="my-4" />

          <div className="flex justify-center">
            <SignInButton>
              <Button className="w-full">Sign in with Clerk</Button>
            </SignInButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


