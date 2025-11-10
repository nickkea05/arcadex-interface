import { useConnect, useDisconnect, useSolana } from '@phantom/react-sdk';
import { useCallback, useMemo, useState, useEffect } from 'react';

const AUTH_MESSAGE = 'Sign to authenticate with our platform';
const SESSION_KEY = 'walletAuth';

export interface UseWalletReturn {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  connected: boolean;
  address: string | null;
  formattedAddress: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useWallet = (): UseWalletReturn => {
  const { connect: phantomConnect, isConnecting } = useConnect();
  const { disconnect: phantomDisconnect } = useDisconnect();
  const { solana } = useSolana();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSigningMessage, setIsSigningMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const address = solana?.publicKey?.toString() || null;
  

  
  // Check for existing valid session on mount
  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session && address && session === address) {
      setIsAuthenticated(true);
      setError(null);
    } else if (address && !session) {
      // Wallet connected but no session - need signature
      requestSignature();
    }
  }, [address]);


  const requestSignature = useCallback(async () => {
    if (!solana || !address) return;
    
    try {
      setIsSigningMessage(true);
      setError(null);
      
      // Create message with timestamp to ensure uniqueness
      const message = `${AUTH_MESSAGE}\n\nWallet: ${address}\nTimestamp: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      
      // Request signature from Phantom
      const signature = await solana.signMessage(encodedMessage);
      
      if (signature) {
        // Store session after successful signature
        localStorage.setItem(SESSION_KEY, address);
        setIsAuthenticated(true);
        console.log('Authentication successful');
      }
    } catch (error: any) {
      console.error('User rejected signature:', error);
      setError('Signature rejected by user');
      // If user rejects, disconnect
      await phantomDisconnect();
      setIsAuthenticated(false);
    } finally {
      setIsSigningMessage(false);
    }
  }, [solana, address, phantomDisconnect]);

  const connect = useCallback(async () => {
    try {
      setError(null);
      // Clear any existing session to force new signature
      localStorage.removeItem(SESSION_KEY);
      setIsAuthenticated(false);
      
      // Connect wallet
      const { addresses } = await phantomConnect();
      console.log('Connected addresses:', addresses);
      
      // requestSignature will be triggered by useEffect when address updates
      
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      const errorMessage = error?.message?.includes('User rejected')
        ? 'Connection rejected by user'
        : error?.message?.includes('not installed')
        ? 'Phantom wallet not installed'
        : 'Failed to connect wallet';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [phantomConnect]);

  const disconnect = useCallback(async () => {
    try {
      setError(null);
      // Clear session
      localStorage.removeItem(SESSION_KEY);
      setIsAuthenticated(false);
      
      // Disconnect wallet
      await phantomDisconnect();
      
    } catch (error: any) {
      console.error('Failed to disconnect wallet:', error);
      setError('Failed to disconnect wallet');
      throw new Error('Failed to disconnect wallet');
    }
  }, [phantomDisconnect]);

  // User is only "connected" if authenticated
  const connected = Boolean(address && isAuthenticated);
  const isLoading = isConnecting || isSigningMessage;

  const formattedAddress = useMemo(() => {
    if (!connected) return null;
    return `${address?.slice(0, 4)}...${address?.slice(-4)}`;
  }, [address, connected]);

  return {
    connect,
    disconnect,
    connected,
    address: connected ? address : null,
    formattedAddress,
    isLoading,
    error,
  };
};
