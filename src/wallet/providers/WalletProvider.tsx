import React from 'react';
import { PhantomProvider } from '@phantom/react-sdk';
import { AddressType } from '@phantom/react-sdk';

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  return (
    <PhantomProvider
      config={{
        providerType: "injected",
        addressTypes: [AddressType.solana],
        autoConnect: true, // Auto-connect when page loads
        appMetadata: {
          name: "ArcadeX",
          description: "ArcadeX Trading Platform",
          icon: `${window.location.origin}/icons/logo.svg`, // Full URL path
          url: window.location.origin, // Current domain
        },
      }}
      children={children}
    />
  );
};