import { SignInButton } from "@clerk/nextjs";

export default function Login() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignInButton mode="modal">
        <button className="bg-blue-600 px-6 py-2 rounded-lg text-white">
          Login with Google
        </button>
      </SignInButton>
    </div>
  );
}