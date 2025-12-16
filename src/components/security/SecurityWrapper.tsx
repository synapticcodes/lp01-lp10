
import React from 'react';
import { useSecurityProtection } from '@/hooks/useSecurityProtection';

interface SecurityWrapperProps {
  children: React.ReactNode;
}

export const SecurityWrapper = ({ children }: SecurityWrapperProps) => {
  useSecurityProtection();

  return (
    <div className="security-protected">
      {children}
    </div>
  );
};
