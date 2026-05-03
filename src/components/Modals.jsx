import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

async function sendViaEmailJS({ feedbackType, message, replyTo }) {
  const payload = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_PUBLIC_KEY,
    template_params: {
      feedback_type: feedbackType,
      message,
      reply_to: replyTo || 'no-reply@convertlab.app',
      from_name: replyTo ? replyTo.split('@')[0] : 'Anonymous',
      time: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
    },
  }

  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`EmailJS error ${res.status}: ${text}`)
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export function FeedbackModal() {
  const { modal, setModal, showToast, addNotification } = useApp()

  const [type, setType] = useState('suggestion')
  const [text, setText] = useState('')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  if (modal !== 'feedback') return null

  const handleSubmit = async () => {
    if (!text.trim()) {
      showToast('Please write your feedback first', 'warn')
      return
    }

    setLoading(true)
    try {
      await sendViaEmailJS({
        feedbackType: type,
        message: text.trim(),
        replyTo: email.trim() || null,
      })

      setSent(true)
      addNotification({
        type: 'tip',
        title: 'Thank you for your feedback!',
        body: 'Your feedback was sent successfully.',
      })
      setTimeout(() => {
        setModal(null)
        setSent(false)
        setText('')
        setEmail('')
      }, 2500)
    } catch (err) {
      console.error('Feedback send failed:', err)
      showToast('Failed to send feedback. Please try again.', 'err')
    } finally {
      setLoading(false)
    }
  }

  const types = [
    { id: 'suggestion', label: '💡 Suggestion', desc: 'Feature ideas or improvements' },
    { id: 'bug', label: '🐛 Bug report', desc: 'Something is broken or wrong' },
    { id: 'praise', label: '⭐ Praise', desc: 'Share what you love' },
    { id: 'other', label: '💬 Other', desc: 'Anything else' },
  ]

  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <div className="modal-box" style={{ width: '100%', maxWidth: 460 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1rem' }}>💬 Send Feedback</span>
          <button onClick={() => setModal(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 18 }}>✕</button>
        </div>

        {sent ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎉</div>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Thank you!</div>
            <div style={{ color: 'var(--text2)', fontSize: 13 }}>Your feedback was sent successfully.</div>
          </div>
        ) : (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {types.map(t => (
                <button key={t.id} onClick={() => setType(t.id)}
                  style={{ textAlign: 'left', padding: '0.65rem 0.85rem', borderRadius: 10, border: `1px solid ${type === t.id ? 'var(--accent)' : 'var(--border)'}`, background: type === t.id ? 'rgba(124,109,255,0.08)' : 'transparent', cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{t.desc}</div>
                </button>
              ))}
            </div>

            <textarea value={text} onChange={e => setText(e.target.value)} rows={5}
              placeholder="Describe your idea, bug, or experience..." style={{ width: '100%' }} disabled={loading} />

            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com (optional)" disabled={loading} />

            <button onClick={handleSubmit} disabled={loading}
              style={{ padding: '0.6rem 1rem', borderRadius: 10, border: 'none', background: loading ? 'var(--border2)' : 'var(--accent)', color: '#fff', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {loading ? (
                <>
                  <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Sending…
                </>
              ) : 'Send Feedback'}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
      </div>
    </div>
  )
}

export function NotificationsPanel({ onClose }) {
  const { notifications, markRead, markAllRead, unreadCount } = useApp()
  const icons = { new: '🚀', tip: '💡', update: '📦', warn: '⚠️' }
  const relTime = ts => {
    const d = (Date.now() - ts) / 1000
    if (d < 60) return 'just now'
    if (d < 3600) return Math.round(d / 60) + 'm ago'
    if (d < 86400) return Math.round(d / 3600) + 'h ago'
    return Math.round(d / 86400) + 'd ago'
  }
  return (
    <div style={{ position: 'fixed', top: 54, right: 12, width: 340, background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 14, boxShadow: 'var(--shadow)', zIndex: 150, overflow: 'hidden', animation: 'slideUp 0.2s ease' }}>
      <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontWeight: 700, fontSize: 13 }}>Notifications</span>
        {unreadCount > 0 && <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 100, background: 'var(--accent)', color: '#fff' }}>{unreadCount}</span>}
        {unreadCount > 0 && <button onClick={markAllRead} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--accent5)', fontFamily: 'var(--sans)' }}>Mark all read</button>}
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 16, marginLeft: unreadCount ? 0 : 'auto' }}>✕</button>
      </div>
      <div style={{ maxHeight: 380, overflowY: 'auto' }}>
        {notifications.map(n => (
          <div key={n.id} onClick={() => markRead(n.id)}
            style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: n.read ? 'transparent' : 'rgba(124,109,255,0.05)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
            onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(124,109,255,0.05)'}
          >
            <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: 1 }}>{icons[n.type] || '📌'}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontWeight: 600, fontSize: 12.5, color: 'var(--text)' }}>{n.title}</span>
                {!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2, lineHeight: 1.5 }}>{n.body}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>{relTime(n.time)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CoffeeModal() {
  const { modal, setModal } = useApp()
  useEffect(() => {
    const handler = () => setModal('coffee')
    document.addEventListener('open-coffee', handler)
    return () => document.removeEventListener('open-coffee', handler)
  }, [setModal])

  if (modal !== 'coffee') return null
  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <div className="modal-box" style={{ width: '100%', maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <div style={{ fontSize: '3rem' }}>☕</div>
          <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.4rem' }}>Buy me a coffee</div>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75, maxWidth: 300 }}>
            ConvertLab is free, open-source, and ad-free. Built by <strong>André Matias</strong> in Portugal 🇵🇹. If it saves you time, a coffee goes a long way!
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            {[
              { label: '☕ One coffee', amount: '€3', color: '#ffba3b' },
              { label: '☕☕ Two coffees', amount: '€5', color: '#fd9a00' },
              { label: '🍕 A slice of pizza', amount: '€10', color: '#ff5f7e' },
            ].map(opt => (
              <a key={opt.amount} href="https://buymeacoffee.com/andrematiasdev" target="_blank" rel="noreferrer"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.1rem', borderRadius: 12, border: `1px solid ${opt.color}33`, background: opt.color + '0f', color: 'var(--text)', textDecoration: 'none', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = opt.color + '1f'; e.currentTarget.style.borderColor = opt.color + '66' }}
                onMouseLeave={e => { e.currentTarget.style.background = opt.color + '0f'; e.currentTarget.style.borderColor = opt.color + '33' }}>
                <span style={{ fontSize: 14 }}>{opt.label}</span>
                <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: opt.color }}>{opt.amount}</span>
              </a>
            ))}
          </div>
          <a href="https://github.com/Amatias13/convertlab" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--text3)', textDecoration: 'none' }}>
            Or ⭐ star the repo on GitHub — it helps a lot!
          </a>
          <button onClick={() => setModal(null)} style={{ fontSize: 12, color: 'var(--text3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)' }}>Maybe later</button>
        </div>
      </div>
    </div>
  )
}

export function ToastStack() {
  const { toasts } = useApp()
  const colors = { info: 'var(--accent5)', success: 'var(--accent3)', warn: 'var(--accent4)', err: 'var(--accent2)' }
  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999, pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{ padding: '0.55rem 1rem 0.55rem 0.85rem', background: 'var(--bg3)', border: `1px solid ${colors[t.type] || 'var(--border2)'}44`, borderLeft: `3px solid ${colors[t.type] || 'var(--accent)'}`, borderRadius: 10, fontSize: 12.5, color: 'var(--text)', boxShadow: 'var(--shadow)', animation: 'slideUp 0.2s ease', maxWidth: 300 }}>
          {t.msg}
        </div>
      ))}
    </div>
  )
}
