// pages/auth/signin.tsx
import { signIn } from "next-auth/react";

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="mb-8 text-2xl font-semibold text-center">Sign in</h2>
        <button
          className="w-full px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600"
          onClick={() => signIn("google")}
        >
          Sign in with Google
        </button>
        <button
          className="w-full px-4 py-2 text-white bg-gray-800 rounded hover:bg-gray-900"
          onClick={() => signIn("github")}
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
};

export default SignInPage;
