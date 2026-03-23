# KGA Life – Claim Assessment Form

This is a lightweight, Vercel-ready web form for **KGA Life** that forwards submissions (including an uploaded document) to an **n8n webhook**.

## Deploy to Vercel

1. Create a new Vercel project and import this folder.
2. (Recommended) Set an environment variable:
   - `N8N_WEBHOOK_URL` = your n8n webhook URL
3. Deploy.

The website is served from `index.html` and submissions are handled by `api/submit.ts`.

## Notes

- The backend route forwards your form as `multipart/form-data` to the webhook.
- Document uploads are limited to **1 file** and **10MB**.

