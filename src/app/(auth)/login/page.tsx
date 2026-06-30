import LoginForm from "@/components/auth/LoginForm";
import { LoginLeftOverlay } from "@/components/auth/LoginLeftOverlay";
import { redirect } from "next/navigation";
import { auth } from "@/auth";


const Page = async () => {
  const session = await auth();

  if (session) {
    redirect("/user/dashboard");
  }
  

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT SIDE */}
      <LoginLeftOverlay />

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-background p-6">
        <LoginForm />
      </div>
    </div>
  );
};

export default Page;
