import type { Metadata, Viewport } from "next";
import "@fontsource-variable/montserrat/wght.css";
import "@fontsource-variable/montserrat/wght-italic.css";
import "@fontsource-variable/lora/wght.css";
import "@fontsource-variable/lora/wght-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BETTER_AUTH_URL ?? "http://localhost:3000"),
  title: { default: "Daniel Butcher — Lead Developer", template: "%s · Daniel Butcher" },
  description: "Lead developer, full stack. Seven years shipping production React and TypeScript in Toronto.",
};

export const viewport: Viewport = { themeColor: "#f3f2f2", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
