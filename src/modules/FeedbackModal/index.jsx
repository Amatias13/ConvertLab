import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { sendFeedback } from "../../services/feedback";
import { FEEDBACK_TYPES } from "../../constants/tools";
import "./styles.css";

export default function FeedbackModal() {
  const { modal, setModal, showToast, addNotification } = useApp();
  const [type, setType] = useState("suggestion");
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (modal !== "feedback") return null;

  const handleSubmit = async () => {
    if (!text.trim()) {
      showToast("Please write your feedback first", "warn");
      return;
    }
    setLoading(true);
    try {
      await sendFeedback({ feedbackType: type, message: text.trim(), replyTo: email.trim() || null });
      setSent(true);
      addNotification({ type: "tip", title: "Thank you for your feedback!", body: "Your feedback was sent successfully." });
      setTimeout(() => {
        setModal(null);
        setSent(false);
        setText("");
        setEmail("");
      }, 2500);
    } catch (err) {
      console.error("Feedback send failed:", err);
      showToast("Failed to send feedback. Please try again.", "err");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <div className="modal-box feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">💬 Send Feedback</span>
          <button onClick={() => setModal(null)} className="modal-close">
            ✕
          </button>
        </div>

        {sent ? (
          <div className="feedback-success">
            <div className="feedback-success-icon">🎉</div>
            <div className="feedback-success-title">Thank you!</div>
            <div className="feedback-success-body">Your feedback was sent successfully.</div>
          </div>
        ) : (
          <div className="feedback-body">
            <div className="feedback-types">
              {FEEDBACK_TYPES.map((t) => (
                <button key={t.id} onClick={() => setType(t.id)} className={`feedback-type-btn${type === t.id ? " active" : ""}`}>
                  <div className="feedback-type-label">{t.label}</div>
                  <div className="feedback-type-desc">{t.desc}</div>
                </button>
              ))}
            </div>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="Describe your idea, bug, or experience..." disabled={loading} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com (optional)" disabled={loading} />
            <button onClick={handleSubmit} disabled={loading} className={`feedback-submit${loading ? " loading" : ""}`}>
              {loading ? (
                <>
                  <span className="spinner" /> Sending…
                </>
              ) : (
                "Send Feedback"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
