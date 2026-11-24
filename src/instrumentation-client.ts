import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false })],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
