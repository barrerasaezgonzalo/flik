// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN, // 👉 lo copias de tu proyecto en Sentry
  tracesSampleRate: 1.0, // captura performance (ajustalo si quieres)
});
