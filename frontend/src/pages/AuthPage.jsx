import React from "react";
import { SignInButton } from "@clerk/clerk-react";
import "../styles/auth.css"; // Import the CSS file for styling

const AuthPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-hero">
          <div className="brand-container">
            <img src="/logo.png" alt="Presidency Meet" className="brand-logo" />
            <span className="brand-name">Presidency Meet</span>
          </div>

          <h1 className="hero-title">Welcome to the Class✨</h1>
          <p className="hero-subtitle">This is a simple authentication page.</p>

          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">💬</span>
              <span>Real-time messaging</span>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🎥</span>
              <span>Video calls & Meetings</span>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>Secure and Private</span>
            </div>
          </div>

          <SignInButton mode="modal">
            <button className="cta-button">
              Get Started with Presidency Meet
              <span className="button-arrow">→</span>
            </button>
          </SignInButton>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-image-container">
          <img
            src="/auth-i.png"
            alt="Team collaboration"
            className="auth-image"
          />
          <div className="image-overlay"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
