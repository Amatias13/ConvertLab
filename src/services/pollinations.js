// Pollinations.ai API service
// Secret key injected at build time via VITE_ env var (GitHub Actions secret).
// In dev, falls back to anonymous mode automatically.

const SK = import.meta.env.VITE_POLLINATIONS_SK || "";

const isNotice = (text) => text.includes("IMPORTANT NOTICE") || text.includes("legacy text API") || text.includes("enter.pollinations.ai") || text.includes("being deprecated");

async function callWithSK(systemPrompt, userText, model) {
  const res = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SK}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText },
      ],
      temperature: 0.7,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim() || "";
  if (!text) throw new Error("empty_response");
  return text;
}

async function callAnonymous(systemPrompt, userText, model) {
  const res = await fetch("https://text.pollinations.ai/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText },
      ],
      temperature: 0.7,
      private: true,
      referrer: "amatias13.github.io",
      seed: Math.floor(Math.random() * 99999),
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim() || "";
  if (isNotice(text)) throw new Error("deprecation_notice");
  if (!text) throw new Error("empty_response");
  return text;
}

async function callAnonymousGET(systemPrompt, userText, model) {
  const params = new URLSearchParams({
    model,
    system: systemPrompt,
    temperature: "0.7",
    private: "true",
    referrer: "amatias13.github.io",
    seed: String(Math.floor(Math.random() * 99999)),
  });
  const url = `https://text.pollinations.ai/${encodeURIComponent(userText)}?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  if (isNotice(text)) throw new Error("deprecation_notice");
  if (!text.trim()) throw new Error("empty");
  return text.trim();
}

/**
 * Call the Pollinations AI API with automatic fallback chain.
 * @param {string} systemPrompt
 * @param {string} userText
 * @param {string} model - e.g. 'openai'
 * @returns {Promise<string>} - the AI response text
 */
export async function callAI(systemPrompt, userText, model) {
  const hasSK = Boolean(SK);
  const attempts = hasSK
    ? [() => callWithSK(systemPrompt, userText, model), () => callAnonymous(systemPrompt, userText, model), () => callAnonymousGET(systemPrompt, userText, model)]
    : [() => callAnonymous(systemPrompt, userText, model), () => callAnonymousGET(systemPrompt, userText, model), () => callAnonymousGET(systemPrompt, userText, model === "openai" ? "mistral" : "openai")];

  let lastError;
  for (const attempt of attempts) {
    try {
      return await attempt();
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

export const hasSK = Boolean(SK);
