// Splash Screen — AgroPilot Application
// Fully Fluid / Responsive
// Premium Editorial Style, Cinematic Sequence

import React, { useState, useEffect } from 'react';

// ===================================================================
// Injected Styles for Animations & Fullscreen Layout
// ===================================================================
const injectedStyles = `
  @keyframes logoReveal {
    0%   { opacity: 0; transform: scale(0.8) translateY(30px); filter: blur(12px); }
    100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
  }
  @keyframes textReveal {
    0%   { opacity: 0; transform: translateY(20px); filter: blur(4px); }
    100% { opacity: 1; transform: translateY(0); filter: blur(0px); }
  }
  @keyframes progressFill {
    0%   { width: 0%; opacity: 0; }
    10%  { opacity: 1; }
    90%  { width: 100%; opacity: 1; }
    100% { width: 100%; opacity: 0; }
  }
  @keyframes ambientGlow {
    0%, 100% { opacity: 0.4; transform: scale(1) translate(-50%, -50%); }
    50%      { opacity: 0.7; transform: scale(1.15) translate(-45%, -45%); }
  }
  @keyframes exitFade {
    0%   { opacity: 1; transform: scale(1); filter: blur(0px); }
    100% { opacity: 0; transform: scale(1.05); filter: blur(10px); pointer-events: none; }
  }
  @keyframes kenBurns {
    0%   { transform: scale(1.05); }
    100% { transform: scale(1.15); }
  }

  .splash-wrapper {
    position: fixed; inset: 0; z-index: 100;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    overflow: hidden; background: var(--primary-dark, #1C2615);
  }

  .splash-wrapper.exiting {
    animation: exitFade 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  /* Cinematic Background */
  .bg-image {
    position: absolute; inset: -5%; z-index: 1;
    background-image: url('https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=1600&auto=format&fit=crop');
    background-size: cover; background-position: center;
    animation: kenBurns 20s ease-out both;
  }
  .bg-overlay {
    position: absolute; inset: 0; z-index: 2;
    background: linear-gradient(180deg, rgba(28,38,21,0.7) 0%, rgba(28,38,21,0.95) 100%);
    mix-blend-mode: multiply;
  }
  .bg-glow {
    position: absolute; top: 50%; left: 50%; width: 60vw; height: 60vw; min-width: 400px; min-height: 400px;
    background: radial-gradient(circle, rgba(201,151,74,0.15) 0%, transparent 60%);
    border-radius: 50%; pointer-events: none; z-index: 3;
    animation: ambientGlow 6s ease-in-out infinite;
  }
  .bg-grain {
    position: absolute; inset: 0; z-index: 4; pointer-events: none; opacity: 0.45;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  }

  /* Foreground Content */
  .content-layer {
    position: relative; z-index: 10;
    display: flex; flex-direction: column; align-items: center; width: 100%;
  }

  .logo-mark {
    animation: logoReveal 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    filter: drop-shadow(0 12px 24px rgba(201,151,74,0.3));
  }

  .logo-text {
    opacity: 0;
    animation: textReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    animation-delay: 0.5s;
    text-align: center; margin-top: 24px;
  }

  .progress-container {
    position: absolute; bottom: 8vh; left: 50%; transform: translateX(-50%);
    width: 80%; max-width: 320px;
    display: flex; flex-direction: column; align-items: center; gap: 16px;
    opacity: 0; animation: textReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    animation-delay: 1s; z-index: 10;
  }
  
  .progress-track {
    width: 100%; height: 2px; background: rgba(255,255,255,0.1); border-radius: 99px; overflow: hidden;
  }
  
  .progress-fill {
    height: 100%; background: var(--accent, #C9974A);
    box-shadow: 0 0 10px var(--accent, #C9974A);
    animation: progressFill 3.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
    animation-delay: 1s;
  }
`;

// ===================================================================
// Custom Abstract Logo SVG
// ===================================================================
const AgroLogo = () => (
  <svg width="84" height="84" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 2L44 15.5L32 29L20 15.5L32 2Z" fill="var(--accent, #C9974A)"/>
    <path d="M46 19.5L58 33L46 46.5L34 33L46 19.5Z" fill="var(--accent, #C9974A)" fillOpacity="0.75"/>
    <path d="M18 19.5L30 33L18 46.5L6 33L18 19.5Z" fill="var(--accent, #C9974A)" fillOpacity="0.75"/>
    <path d="M32 33L44 46.5L32 60L20 46.5L32 33Z" fill="var(--accent, #C9974A)" fillOpacity="0.4"/>
  </svg>
);

// ===================================================================
// Main Screen Component
// ===================================================================
export default function SplashScreen() {
  const [exiting, setExiting] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing systems...");

  useEffect(() => {
    // Cycle through loading texts to make it feel alive
    const texts = ["Syncing territory data...", "Updating offline maps...", "Ready"];
    let timeouts = [];
    
    texts.forEach((text, i) => {
      timeouts.push(setTimeout(() => setLoadingText(text), 1500 + (i * 800)));
    });

    // Trigger the exit animation
    timeouts.push(setTimeout(() => {
      setExiting(true);
    }, 4200));

    // Redirect logic (in a real app, this routes to Dashboard)
    timeouts.push(setTimeout(() => {
      // e.g. history.push('/dashboard')
      // window.location.href = "Morning Briefing.html";
    }, 5400));

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className={`splash-wrapper ${exiting ? 'exiting' : ''}`}>
      <style>{injectedStyles}</style>

      {/* Layer 1: Cinematic Background Image */}
      <div className="bg-image" />
      
      {/* Layer 2: Deep Color Multiply Overlay */}
      <div className="bg-overlay" />
      
      {/* Layer 3: Ambient Golden Glow */}
      <div className="bg-glow" />

      {/* Layer 4: Paper Grain Texture */}
      <div className="bg-grain" />

      {/* Layer 5: Foreground Content */}
      <div className="content-layer">
        <div className="logo-mark">
          <AgroLogo />
        </div>
        
        <div className="logo-text">
          <h1 style={{ 
            fontFamily: 'Fraunces, serif', 
            fontSize: 'clamp(44px, 8vw, 64px)', 
            fontWeight: 500, 
            margin: '0 0 8px 0', 
            letterSpacing: '-0.02em', 
            color: '#fff' 
          }}>
            Agro<span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--accent, #C9974A)' }}>Pilot</span>
          </h1>
          <div style={{ 
            fontFamily: 'Plus Jakarta Sans, sans-serif', 
            fontSize: 'clamp(12px, 2vw, 15px)', 
            fontWeight: 800, 
            color: 'rgba(255,255,255,0.7)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.4em', 
            paddingLeft: '0.4em' 
          }}>
            Field Intelligence
          </div>
        </div>
      </div>

      {/* Bottom Loading Indicator */}
      <div className="progress-container">
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(201,151,74,0.9)', letterSpacing: '0.05em' }}>
          {loadingText}
        </div>
        <div className="progress-track">
          <div className="progress-fill" />
        </div>
      </div>

    </div>
  );
}