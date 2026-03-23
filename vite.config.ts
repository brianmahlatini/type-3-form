import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const DEFAULT_N8N_WEBHOOK_URL =
  "https://kgadev.app.n8n.cloud/webhook/53151941-0a90-42d6-9050-b7679321073b";

function getDevWebhookUrl(): URL {
  const raw = (process.env.N8N_WEBHOOK_URL || "").trim() || DEFAULT_N8N_WEBHOOK_URL;
  return new URL(raw);
}

export default defineConfig(() => {
  const devWebhookUrl = getDevWebhookUrl();

  return {
    plugins: [react()],
    server: {
      // Dev-only: avoids browser CORS by proxying `/api/submit` to your n8n webhook.
      proxy: {
        "/api/submit": {
          target: `${devWebhookUrl.origin}`,
          changeOrigin: true,
          secure: true,
          rewrite: () => devWebhookUrl.pathname,
        },
      },
    },
  };
});

