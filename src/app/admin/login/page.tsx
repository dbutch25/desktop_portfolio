import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background p-s6">
      <div className="flex w-full max-w-[380px] flex-col gap-s4">
        <div>
          <div className="kicker">Portfolio CMS</div>
          <h1 className="m-0 mt-1 text-[48px] leading-none font-normal">Sign in.</h1>
          <p className="m-0 mt-s2 font-heading text-[18px] text-neutral-700 italic">Administrators only.</p>
        </div>
        <LoginForm />
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
