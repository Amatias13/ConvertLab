const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_USER_ID;

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

/**
 * Send a feedback email via EmailJS.
 * @param {{ feedbackType: string, message: string, replyTo?: string }} params
 */
export async function sendFeedback({ feedbackType, message, replyTo }) {
  const payload = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_PUBLIC_KEY,
    template_params: {
      feedback_type: feedbackType,
      message,
      reply_to: replyTo || "no-reply@ConvertLab.app",
      from_name: replyTo ? replyTo.split("@")[0] : "Anonymous",
      time: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
    },
  };

  const res = await fetch(EMAILJS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`EmailJS error ${res.status}: ${text}`);
  }
}
