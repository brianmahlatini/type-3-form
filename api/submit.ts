export const config = {
  runtime: "edge",
};

const DEFAULT_WEBHOOK_URL =
  "https://kgadev.app.n8n.cloud/webhook/53151941-0a90-42d6-9050-b7679321073b";

function jsonResponse(payload: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init && init.headers ? init.headers : {}),
    },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return jsonResponse({ error: "Invalid form data" }, { status: 400 });
  }

  // Simple bot trap: real users should never fill this.
  const honeypot = String(formData.get("companyWebsite") ?? "").trim();
  if (honeypot) {
    return jsonResponse({ ok: true }, { status: 200 });
  }
  formData.delete("companyWebsite");

  const file = formData.get("documents");
  if (file instanceof File) {
    if (file.size > 10 * 1024 * 1024) {
      return jsonResponse({ error: "Document must be 10MB or less." }, { status: 400 });
    }
  }

  const webhookUrl =
    (process.env.N8N_WEBHOOK_URL && process.env.N8N_WEBHOOK_URL.trim()) || DEFAULT_WEBHOOK_URL;

  // Forward the same multipart form-data to n8n.
  const upstreamRes = await fetch(webhookUrl, {
    method: "POST",
    body: formData,
  });

  if (!upstreamRes.ok) {
    const text = await upstreamRes.text().catch(() => "");
    const snippet = text.length > 400 ? text.slice(0, 400) + "..." : text;
    return jsonResponse(
      {
        error: "Upstream webhook rejected the submission.",
        upstreamStatus: upstreamRes.status,
        upstreamBody: snippet || undefined,
      },
      { status: 502 },
    );
  }

  return jsonResponse({ ok: true }, { status: 200 });
}
