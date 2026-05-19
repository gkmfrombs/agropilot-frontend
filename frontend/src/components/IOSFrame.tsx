import React from 'react';

interface IOSDeviceProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
}

export function IOSDevice({ children }: IOSDeviceProps) {
  return (
    <div className="app-shell">
      {children}
    </div>
  );
}
