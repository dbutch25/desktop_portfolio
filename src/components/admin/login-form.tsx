"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"password" | "totp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const done = () => {
    router.push("/admin");
    router.refresh();
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await authClient.signIn.email({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message ?? "Those details didn't match.");
    if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) return setStep("totp");
    done();
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await authClient.twoFactor.verifyTotp({ code, trustDevice: true });
    setBusy(false);
    if (error) return toast.error(error.message ?? "That code didn't work.");
    done();
  };

  if (step === "totp")
    return (
      <form onSubmit={verify} className="flex flex-col gap-s3 border-t border-divider pt-s4">
        <div>
          <Label htmlFor="code">Authenticator code</Label>
          <Input id="code" inputMode="numeric" autoComplete="one-time-code" autoFocus maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="tracking-[0.3em]" />
        </div>
        <Button type="submit" disabled={busy || code.length !== 6}>
          {busy && <LoaderCircle className="animate-spin" />}
          Verify
        </Button>
      </form>
    );

  return (
    <form onSubmit={signIn} className="flex flex-col gap-s3 border-t border-divider pt-s4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" disabled={busy}>
        {busy && <LoaderCircle className="animate-spin" />}
        Sign in
      </Button>
    </form>
  );
}
