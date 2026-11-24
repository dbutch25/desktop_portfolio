"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function SecurityPanel({ twoFactorEnabled }: { twoFactorEnabled: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [setup, setSetup] = useState<{ uri: string; codes: string[] } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");

  const run = async (fn: () => Promise<{ error: { message?: string } | null }>, ok: string) => {
    setBusy(true);
    const { error } = await fn();
    setBusy(false);
    if (error) toast.error(error.message ?? "That didn't work.");
    else toast.success(ok);
    return !error;
  };

  return (
    <div className="flex flex-col gap-s4">
      <Card>
        <CardHeader>
          <CardTitle>Two-factor authentication</CardTitle>
          <CardDescription>
            {twoFactorEnabled ? "On — you'll be asked for a code from your authenticator app at sign-in." : "Off. Turn it on with any TOTP app (1Password, Authy, Google Authenticator)."}
          </CardDescription>
        </CardHeader>

        {!setup && (
          <div className="flex flex-wrap items-end gap-s2">
            <div className="min-w-[240px] flex-1">
              <Label htmlFor="pw-2fa">Current password</Label>
              <Input id="pw-2fa" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {twoFactorEnabled ? (
              <Button
                variant="destructive"
                disabled={busy || !password}
                onClick={async () => {
                  if (await run(() => authClient.twoFactor.disable({ password }), "Two-factor turned off.")) {
                    setPassword("");
                    router.refresh();
                  }
                }}
              >
                Turn off
              </Button>
            ) : (
              <Button
                disabled={busy || !password}
                onClick={async () => {
                  setBusy(true);
                  const { data, error } = await authClient.twoFactor.enable({ password });
                  setBusy(false);
                  if (error || !data || !("totpURI" in data)) return toast.error(error?.message ?? "Couldn't start setup.");
                  setSetup({ uri: data.totpURI, codes: data.backupCodes });
                  setPassword("");
                }}
              >
                Set up
              </Button>
            )}
          </div>
        )}

        {setup && (
          <div className="grid gap-s4 sm:grid-cols-[auto_1fr]">
            <div className="rounded-md border border-divider bg-white p-3">
              <QRCodeSVG value={setup.uri} size={168} />
            </div>
            <div className="flex flex-col gap-s3">
              <p className="m-0 text-[14px]">Scan with your authenticator app, then enter the 6-digit code to finish.</p>
              <div className="flex gap-s2">
                <Input inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="123456" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="max-w-[160px] tracking-[0.3em]" />
                <Button
                  disabled={busy || code.length !== 6}
                  onClick={async () => {
                    if (await run(() => authClient.twoFactor.verifyTotp({ code }), "Two-factor is on.")) {
                      setSetup(null);
                      setCode("");
                      router.refresh();
                    }
                  }}
                >
                  Verify
                </Button>
              </div>
              <div>
                <h6 className="mb-1 text-neutral-700">Backup codes — store these somewhere safe</h6>
                <div className="grid grid-cols-2 gap-1 font-mono text-[13px] sm:grid-cols-5">
                  {setup.codes.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>At least 12 characters. Signs out your other sessions.</CardDescription>
        </CardHeader>
        <form
          className="grid gap-s3 sm:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (await run(() => authClient.changePassword({ currentPassword: cur, newPassword: next, revokeOtherSessions: true }), "Password changed.")) {
              setCur("");
              setNext("");
            }
          }}
        >
          <div>
            <Label htmlFor="pw-cur">Current password</Label>
            <Input id="pw-cur" type="password" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="pw-new">New password</Label>
            <Input id="pw-new" type="password" autoComplete="new-password" minLength={12} value={next} onChange={(e) => setNext(e.target.value)} />
          </div>
          <div>
            <Button type="submit" disabled={busy || !cur || next.length < 12}>
              Change password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
