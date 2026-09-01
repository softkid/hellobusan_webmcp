import React, { useState } from "react";
import { X, CheckCircle2, ShieldCheck, LogOut } from "lucide-react";

export default function GoogleAuthModal({ isOpen, onClose, user, onSignIn, onSignOut }) {
  if (!isOpen) return null;

  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState({
    name: "Kim Minjun",
    email: "minjun.kim@gmail.com",
    picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    plan: "Premium Plan"
  });

  const handleSimulateGoogleLogin = () => {
    onSignIn({
      name: selectedGoogleAccount.name,
      email: selectedGoogleAccount.email,
      picture: selectedGoogleAccount.picture,
      plan: "Premium Plan",
      isAuthenticated: true
    });
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(3, 7, 18, 0.85)",
      backdropFilter: "blur(12px)",
      zIndex: 3500,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }}>
      <div
        className="glass-panel-glow"
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "1.75rem",
          borderRadius: "18px",
          border: "1px solid rgba(0, 242, 254, 0.4)",
          position: "relative"
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.2rem", right: "1.2rem",
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer"
          }}
        >
          <X size={18} />
        </button>

        {/* Google Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <div style={{
            width: "54px",
            height: "54px",
            borderRadius: "50%",
            background: "#ffffff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 25px rgba(255, 255, 255, 0.2)",
            marginBottom: "0.75rem"
          }}>
            {/* Google official colored 'G' svg */}
            <svg width="28" height="28" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </div>
          <h3 style={{ fontSize: "1.2rem", margin: 0, color: "#ffffff" }}>
            Sign in with Google
          </h3>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Authenticate with Google Identity Services (OAuth 2.0)
          </span>
        </div>

        {/* Status: Logged in or Logged out */}
        {user?.isAuthenticated ? (
          <div style={{ textAlign: "center", padding: "1rem", background: "rgba(10, 15, 26, 0.8)", border: "1px solid var(--border)", borderRadius: "12px", marginBottom: "1.25rem" }}>
            <img
              src={user.picture}
              alt={user.name}
              style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid #00f2fe", marginBottom: "0.5rem" }}
            />
            <strong style={{ fontSize: "1.05rem", color: "#ffffff", display: "block" }}>{user.name}</strong>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>{user.email}</span>
            <span className="badge badge-allow" style={{ fontSize: "0.68rem" }}>
              <ShieldCheck size={12} /> {user.plan} Active
            </span>

            <button
              onClick={() => { onSignOut(); onClose(); }}
              className="btn-secondary"
              style={{ marginTop: "1rem", width: "100%", justifyContent: "center", borderColor: "rgba(255, 82, 82, 0.4)", color: "#ff6b6b" }}
            >
              <LogOut size={15} /> Sign Out of Google
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            
            {/* Account Card Selection */}
            <div style={{
              background: "rgba(10, 15, 26, 0.9)",
              border: "1px solid rgba(0, 242, 254, 0.3)",
              borderRadius: "12px",
              padding: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              cursor: "pointer"
            }}>
              <img
                src={selectedGoogleAccount.picture}
                alt={selectedGoogleAccount.name}
                style={{ width: "42px", height: "42px", borderRadius: "50%" }}
              />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: "0.9rem", color: "#ffffff", display: "block" }}>{selectedGoogleAccount.name}</strong>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{selectedGoogleAccount.email}</span>
              </div>
              <CheckCircle2 size={18} color="#00f2fe" />
            </div>

            {/* Google OAuth One-Tap Sign In Button */}
            <button
              onClick={handleSimulateGoogleLogin}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "10px",
                border: "none",
                background: "#ffffff",
                color: "#1f2937",
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                boxShadow: "0 4px 15px rgba(255,255,255,0.2)"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Continue as Kim Minjun
            </button>

            <span style={{ fontSize: "0.68rem", color: "var(--text-dim)", textAlign: "center" }}>
              OAuth Client ID: <code style={{ color: "#00f2fe" }}>hellobusan-google-auth.apps.googleusercontent.com</code>
            </span>

          </div>
        )}

      </div>
    </div>
  );
}
