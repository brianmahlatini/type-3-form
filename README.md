# KGA Life – Claim Assessment Form (React + Vite + Tailwind)

Professional, Vercel-ready claim assessment form for **KGA Life**.

- Frontend: React + Vite + Tailwind (`src/App.tsx`)
- Backend: Vercel Serverless/Edge function that forwards submissions to **n8n** (`api/submit.ts`)

## Local development

```bash
npm install
npm run dev
```

The Vite dev server proxies `POST /api/submit` to your n8n webhook to avoid browser CORS.

To use your own webhook in dev:

```bash
setx N8N_WEBHOOK_URL "https://YOUR-N8N/webhook/..."
```

## Deploy to Vercel

1. Import this repo/folder into Vercel.
2. (Recommended) Set env var:
   - `N8N_WEBHOOK_URL` = your n8n webhook URL
3. Deploy.

## Limits

- Upload: **1 file**, max **10MB**
