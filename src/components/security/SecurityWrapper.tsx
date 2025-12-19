
import React from 'react';

interface SecurityWrapperProps {
  children: React.ReactNode;
}

export const SecurityWrapper = ({ children }: SecurityWrapperProps) => {
  return (
    <div className="security-protected">
      {children}
    </div>
  );
};
