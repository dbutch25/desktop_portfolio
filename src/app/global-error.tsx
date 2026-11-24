"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#1f1e1e", color: "#eae7e7", fontFamily: "Georgia, serif" }}>
        <div style={{ maxWidth: 520, padding: 28 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9b9797" }}>Fatal exception</div>
          <h1 style={{ fontSize: 44, fontWeight: 400, margin: "12px 0" }}>Something crashed.</h1>
          <p style={{ color: "#bab6b6" }}>The error has been reported. Restarting usually helps.</p>
          <button onClick={reset} style={{ font: "inherit", padding: "9px 16px", background: "transparent", color: "#e1ad66", border: "1px solid #e1ad66", borderRadius: 4, cursor: "pointer" }}>
            Restart
          </button>
        </div>
      </body>
    </html>
  );
}
