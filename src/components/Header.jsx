import React, { useState } from "react";
import { ShieldCheck, Sparkles, Globe, LogIn } from "lucide-react";
import { TRANSLATIONS } from "../constants/translations.js";
import GoogleAuthModal from "./GoogleAuthModal.jsx";

export default function Header({
  goalPrompt,
  setGoalPrompt,
  isWorking,
  onRunAgent,
  activeTab,
  setActiveTab,
  lang = "en",
  setLang,
  user,
  setUser
}) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const toggleLanguage = () => {
    setLang(lang === "en" ? "ko" : "en");
  };

  const handleSignIn = (newUser) => {
    setUser(newUser);
  };

  const handleSignOut = () => {
    setUser({ isAuthenticated: false });
  };

  return (
    <header style={{ marginBottom: "1rem" }}>
      {/* Top Main Navigation Header */}
      <div className="glass-panel" style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 15px rgba(0, 242, 254, 0.4)",
            fontWeight: 900,
            color: "#070a13",
            fontSize: "1.2rem",
            fontFamily: "var(--font-heading)"
          }}>
            A
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <h1 style={{ fontSize: "1.25rem", margin: 0, letterSpacing: "0.02em", color: "#ffffff" }}>
                {t.brandTitle}
              </h1>
              <span className="badge-status badge-allow" style={{ fontSize: "0.6rem", padding: "0.1rem 0.4rem" }}>
                WEBMCP ENABLED
              </span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
              {t.brandSubtitle}
            </p>
          </div>
        </div>

        {/* Center Goal Bar in Header */}
        <div style={{
          flex: 1,
          maxWidth: "520px",
          background: "rgba(10, 15, 26, 0.9)",
          border: "1px solid var(--border-active)",
          borderRadius: "10px",
          padding: "0.4rem 0.75rem",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem"
        }}>
          <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontWeight: 700, flexShrink: 0 }}>
            {t.goalLabel}
          </div>
          <input
            type="text"
            value={goalPrompt}
            onChange={(e) => setGoalPrompt(e.target.value)}
            placeholder={t.goalPlaceholder}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#ffffff",
              fontSize: "0.82rem",
              fontFamily: "var(--font-sans)"
            }}
          />
          <button
            onClick={onRunAgent}
            disabled={isWorking}
            style={{
              background: "linear-gradient(135deg, #7f56d9 0%, #9e77ed 100%)",
              border: "none",
              borderRadius: "8px",
              padding: "0.35rem 0.6rem",
              color: "#ffffff",
              cursor: isWorking ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            title="Execute Agent Planner"
          >
            <Sparkles size={15} />
          </button>
        </div>

        {/* Right Controls: Language Switcher, Safe Mode, Google Profile & Tab Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          
          {/* i18n Language Switcher Button (EN / KO) */}
          <button
            onClick={toggleLanguage}
            style={{
              background: "rgba(0, 242, 254, 0.12)",
              border: "1px solid rgba(0, 242, 254, 0.35)",
              color: "#00f2fe",
              padding: "0.35rem 0.65rem",
              borderRadius: "8px",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              fontFamily: "var(--font-mono)"
            }}
            title="Switch Language (English / 한국어)"
          >
            <Globe size={14} /> {lang.toUpperCase()}
          </button>

          {/* Safe Mode Badge */}
          <div style={{
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            padding: "0.35rem 0.7rem",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.75rem"
          }}>
            <ShieldCheck size={16} color="#34d399" />
            <div>
              <strong style={{ color: "#34d399", display: "block", lineHeight: 1 }}>{t.safeMode}</strong>
              <span style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>{t.humanInControl}</span>
            </div>
          </div>

          {/* Google Profile Pill Button */}
          {user?.isAuthenticated ? (
            <div
              onClick={() => setIsAuthModalOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                padding: "0.25rem 0.5rem",
                borderRadius: "20px",
                background: "rgba(15, 23, 42, 0.7)",
                border: "1px solid rgba(0, 242, 254, 0.3)"
              }}
              title="Google Account Profile"
            >
              <img
                src={user.picture}
                alt={user.name}
                style={{ width: "28px", height: "28px", borderRadius: "50%" }}
              />
              <div style={{ fontSize: "0.75rem" }}>
                <strong style={{ color: "#ffffff", display: "block", lineHeight: 1.1 }}>{user.name}</strong>
                <span style={{ fontSize: "0.65rem", color: "#00f2fe" }}>{user.plan}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              style={{
                background: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "0.35rem 0.75rem",
                color: "#1f2937",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Sign in with Google
            </button>
          )}

          {/* Tab Switcher */}
          <div style={{ display: "flex", background: "rgba(0,0,0,0.4)", padding: "0.2rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <button
              onClick={() => setActiveTab("workspace")}
              style={{
                padding: "0.35rem 0.7rem",
                borderRadius: "6px",
                border: "none",
                background: activeTab === "workspace" ? "rgba(0, 242, 254, 0.15)" : "transparent",
                color: activeTab === "workspace" ? "#00f2fe" : "var(--text-muted)",
                fontWeight: 600,
                fontSize: "0.78rem",
                cursor: "pointer"
              }}
            >
              {t.workspaceTab}
            </button>
            <button
              onClick={() => setActiveTab("doc")}
              style={{
                padding: "0.35rem 0.7rem",
                borderRadius: "6px",
                border: "none",
                background: activeTab === "doc" ? "rgba(52, 211, 153, 0.15)" : "transparent",
                color: activeTab === "doc" ? "#34d399" : "var(--text-muted)",
                fontWeight: 600,
                fontSize: "0.78rem",
                cursor: "pointer"
              }}
            >
              {t.docsTab}
            </button>
            <button
              onClick={() => setActiveTab("benchmark")}
              style={{
                padding: "0.35rem 0.7rem",
                borderRadius: "6px",
                border: "none",
                background: activeTab === "benchmark" ? "rgba(127, 86, 217, 0.2)" : "transparent",
                color: activeTab === "benchmark" ? "#a855f7" : "var(--text-muted)",
                fontWeight: 600,
                fontSize: "0.78rem",
                cursor: "pointer"
              }}
            >
              {t.benchmarkTab}
            </button>
          </div>

        </div>

      </div>

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />
    </header>
  );
}
