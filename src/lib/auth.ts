import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  appName: "Portfolio CMS",
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    // Admins are created by the seed script — nobody can sign up from the web.
    disableSignUp: true,
    minPasswordLength: 12,
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "user", input: false },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
  rateLimit: { enabled: true, window: 60, max: 20 },
  plugins: [twoFactor({ issuer: "Portfolio CMS" }), nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
