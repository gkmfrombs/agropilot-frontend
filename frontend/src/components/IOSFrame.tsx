import React, { useEffect, useState } from 'react';

interface IOSDeviceProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
}

export function IOSDevice({ children, width = 390, height = 844 }: IOSDeviceProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Mobile: full screen, no device chrome
  if (isMobile) {
    return (
      <div style={{ width: '100%', height: '100dvh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative', WebkitOverflowScrolling: 'touch' }} className="no-scrollbar">
          {children}
        </div>
      </div>
    );
  }

  // Desktop: device frame
  return (
    <div style={{
      width, height, borderRadius: 48,
      background: '#000',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Dynamic Island */}
      <div style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 999,
      }} />

      {/* Inner screen */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 48, overflow: 'hidden',
        display: 'flex', flexDirection: 'column', background: 'var(--bg)',
      }}>
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative', WebkitOverflowScrolling: 'touch' }} className="no-scrollbar">
          {children}
        </div>
      </div>

      {/* Home Indicator */}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 139, height: 5, borderRadius: 100, background: 'rgba(0,0,0,0.3)', zIndex: 999,
      }} />
    </div>
  );
}
