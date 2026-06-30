import RegisterForm from "@/components/auth/RegisterForm";
import { RegisterLeftOverlay } from "@/components/auth/RegisterLeftOverlay";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

const RegisterPage = async () => {
  const session = await auth();

  if (session) {
    redirect("/user/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0b1326] text-white">
      {/* LEFT SIDE */}
      <RegisterLeftOverlay />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
