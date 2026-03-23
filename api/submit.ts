const DEFAULT_WEBHOOK_URL =
  "https://kgadev.app.n8n.cloud/webhook/53151941-0a90-42d6-9050-b7679321073b";

function sendJson(res: any, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(payload));
}

async function readRequestBody(req: any, maxBytes: number): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buf.length;
    if (total > maxBytes) throw new Error("PAYLOAD_TOO_LARGE");
    chunks.push(buf);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: any, res: any): Promise<void> {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("cache-control", "no-store");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  const contentType = String(req.headers?.["content-type"] || "");
  if (!contentType) {
    sendJson(res, 400, { error: "Missing Content-Type header" });
    return;
  }

  const webhookUrl =
    (process.env.N8N_WEBHOOK_URL && process.env.N8N_WEBHOOK_URL.trim()) || DEFAULT_WEBHOOK_URL;

  // Enforce an overall payload limit (form fields + multipart overhead included).
  // Document max is 10MB; allow a little overhead for multipart encoding.
  const MAX_TOTAL_BYTES = 11 * 1024 * 1024;

  let body: Buffer;
  try {
    body = await readRequestBody(req, MAX_TOTAL_BYTES);
  } catch (e: any) {
    if (e && e.message === "PAYLOAD_TOO_LARGE") {
      sendJson(res, 413, { error: "Upload too large. Max 10MB document." });
      return;
    }
    sendJson(res, 400, { error: "Invalid request body" });
    return;
  }

  const upstreamRes = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": contentType,
    },
    body,
  });

  if (!upstreamRes.ok) {
    const text = await upstreamRes.text().catch(() => "");
    const snippet = text.length > 400 ? text.slice(0, 400) + "..." : text;
    sendJson(res, 502, {
      error: "Upstream webhook rejected the submission.",
      upstreamStatus: upstreamRes.status,
      upstreamBody: snippet || undefined,
    });
    return;
  }

  sendJson(res, 200, { ok: true });
}
