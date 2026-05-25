import { useApp } from "../../context/AppContext";
import { COFFEE_OPTIONS } from "../../constants/tools";
import { GITHUB_URL, BUY_COFFEE_URL } from "../../constants/app";
import "./styles.css";

export default function CoffeeModal() {
  const { modal, setModal } = useApp();
  if (modal !== "coffee") return null;

  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <div className="modal-box coffee-modal" onClick={(e) => e.stopPropagation()}>
        <div className="coffee-body">
          <div className="coffee-icon">☕</div>
          <div className="coffee-title">Buy me a coffee</div>
          <p className="coffee-desc">
            ConvertLab is free, open-source, and ad-free. Built by <strong>André Matias</strong> in Portugal 🇵🇹. If it saves you time, a coffee goes a long way!
          </p>
          <div className="coffee-options">
            {COFFEE_OPTIONS.map((opt) => (
              <a key={opt.amount} href={BUY_COFFEE_URL} target="_blank" rel="noreferrer" className="coffee-option" style={{ borderColor: opt.color + "33", background: opt.color + "0f" }}>
                <span className="coffee-option-label">{opt.label}</span>
                <span className="coffee-option-amount" style={{ color: opt.color }}>
                  {opt.amount}
                </span>
              </a>
            ))}
          </div>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="coffee-github">
            Or ⭐ star the repo on GitHub — it helps a lot!
          </a>
          <button onClick={() => setModal(null)} className="coffee-later">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
