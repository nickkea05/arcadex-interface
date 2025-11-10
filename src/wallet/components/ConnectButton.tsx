import React, { useState, useEffect, useRef } from 'react';
import { colors } from '../../theme';
import { useWallet } from '../hooks/useWallet';

interface ConnectButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({ 
  className = '', 
  style = {} 
}) => {
  const { connect, disconnect, connected, formattedAddress, address, isLoading, error: walletError } = useWallet();
  const [localError, setLocalError] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  const handleClick = async () => {
    console.log('Button clicked, connected:', connected);
    setLocalError(null);
    
    try {
      if (connected) {
        // Show dashboard instead of disconnecting
        setShowDashboard(!showDashboard);
      } else {
        // Show wallet selector instead of directly connecting
        setShowWalletSelector(true);
      }
    } catch (err: any) {
      console.error('Connection error:', err);
      setLocalError(err.message || 'An error occurred');
    }
  };

  const handleWalletConnect = async () => {
    try {
      console.log('Connecting...');
      await connect();
      console.log('Connected successfully');
      setShowWalletSelector(false);
    } catch (err: any) {
      console.error('Connection error:', err);
      setLocalError(err.message || 'An error occurred');
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setShowDashboard(false);
    } catch (err: any) {
      console.error('Disconnect error:', err);
      setLocalError(err.message || 'Failed to disconnect');
    }
  };

  // Close wallet selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setShowWalletSelector(false);
      }
    };

    if (showWalletSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showWalletSelector]);

  // Close dashboard when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dashboardRef.current && !dashboardRef.current.contains(event.target as Node)) {
        setShowDashboard(false);
      }
    };

    if (showDashboard) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDashboard]);

  const buttonText = () => {
    if (isLoading) return 'Signing...';
    if (connected) return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Address - moved more to the right, showing more characters */}
        <span style={{ 
          fontSize: '14px', // Match the smaller button size
          fontWeight: '600' // Bolder text
        }}>
          {formattedAddress || 'Connected'}
        </span>
        {/* Custom Dropdown Arrow */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );
    return 'Connect Wallet';
  };

  // Use wallet error if available, otherwise use local error
  const displayError = walletError || localError;

  const buttonStyle: React.CSSProperties = {
    border: connected ? '1.5px solid #555555' : 'none', // Slightly thicker outline
    borderRadius: '50px', // Very rounded, oval-like edges
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontWeight: connected ? '400' : '600', // Thicker when disconnected
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '8px 16px', // Same size for both states
    fontSize: '14px', // 30% smaller font
    opacity: isLoading ? 0.6 : 1,
    backgroundColor: connected ? 'transparent' : colors.mainAccentColor, // Transparent when connected, blue when disconnected
    color: connected ? colors.mainTextColor : colors.buttonTextColor, // White when connected, background color when disconnected
    minWidth: 'auto', // No minimum width difference
    boxShadow: 'none', // No glow effect
    ...style,
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={isLoading}
        className={className}
        style={buttonStyle}
        onMouseEnter={(e) => {
          if (!isLoading) {
            if (connected) {
              e.currentTarget.style.opacity = '0.8';
            } else {
              e.currentTarget.style.backgroundColor = colors.accentBright; // Brighter blue
              e.currentTarget.style.boxShadow = 'none'; // No glow effect
            }
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            if (connected) {
              e.currentTarget.style.opacity = '1';
            } else {
              e.currentTarget.style.backgroundColor = colors.mainAccentColor; // Back to original blue
              e.currentTarget.style.boxShadow = 'none'; // No glow effect
            }
          }
        }}
      >
        {buttonText()}
      </button>
      
      {/* Wallet Selector Popup */}
      {showWalletSelector && !connected && (
        <div 
          ref={selectorRef}
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            marginTop: '8px',
            backgroundColor: colors.dropdownBackground,
            border: '1px solid #333333',
            borderRadius: '8px',
            padding: '20px',
            width: '320px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ 
              color: 'white', 
              fontSize: '16px', 
              fontWeight: '600',
              margin: 0 
            }}>
              Connect a wallet on Solana to continue
            </h3>
            <button 
              onClick={() => setShowWalletSelector(false)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: colors.secondaryTextColor,
                cursor: 'pointer',
                fontSize: '24px',
                padding: '2px',
                position: 'absolute',
                top: '8px',
                right: '8px'
              }}
            >
              ×
            </button>
          </div>

          {/* Wallet Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Phantom */}
            <button
              onClick={handleWalletConnect}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'transparent',
                border: '1px solid #333333',
                borderRadius: '8px',
                padding: '12px 16px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.buttonGreyHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Phantom Icon */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 1200 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_2596_138588)">
                      <rect width="1200" height="1200" rx="257.592" fill="#AB9FF2"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M517.219 779.814C470.102 852.012 391.148 943.378 286.09 943.378C236.426 943.378 188.672 922.933 188.672 834.122C188.672 607.943 497.48 257.813 784.004 257.813C947.004 257.813 1011.95 370.902 1011.95 499.326C1011.95 664.168 904.98 852.651 798.648 852.651C764.902 852.651 748.347 834.122 748.347 804.732C748.347 797.065 749.621 788.759 752.168 779.814C715.875 841.789 645.836 899.292 580.254 899.292C532.5 899.292 508.305 869.263 508.305 827.094C508.305 811.76 511.488 795.787 517.219 779.814ZM904.363 494.869C904.363 532.291 882.284 551.002 857.586 551.002C832.514 551.002 810.809 532.291 810.809 494.869C810.809 457.448 832.514 438.737 857.586 438.737C882.284 438.737 904.363 457.448 904.363 494.869ZM764.031 494.871C764.031 532.293 741.952 551.004 717.254 551.004C692.182 551.004 670.477 532.293 670.477 494.871C670.477 457.449 692.182 438.739 717.254 438.739C741.952 438.739 764.031 457.449 764.031 494.871Z" fill="#FFFDF8"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_2596_138588">
                        <rect width="1200" height="1200" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>Phantom</span>
              </div>
              <span style={{ color: colors.secondaryTextColor, fontSize: '12px' }}>Detected</span>
            </button>

            {/* MetaMask */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'transparent',
                border: '1px solid #333333',
                borderRadius: '8px',
                padding: '12px 16px',
                opacity: '0.5',
                width: '100%'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* MetaMask Icon */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 142 136.878" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#FF5C16" d="M132.682,132.192l-30.583-9.106l-23.063,13.787l-16.092-0.007l-23.077-13.78l-30.569,9.106L0,100.801
                      l9.299-34.839L0,36.507L9.299,0l47.766,28.538h27.85L132.682,0l9.299,36.507l-9.299,29.455l9.299,34.839L132.682,132.192
                      L132.682,132.192z"/>
                    <path fill="#FF5C16" d="M9.305,0l47.767,28.558l-1.899,19.599L9.305,0z M39.875,100.814l21.017,16.01l-21.017,6.261
                      C39.875,123.085,39.875,100.814,39.875,100.814z M59.212,74.345l-4.039-26.174L29.317,65.97l-0.014-0.007v0.013l0.08,18.321
                      l10.485-9.951L59.212,74.345L59.212,74.345z M132.682,0L84.915,28.558l1.893,19.599L132.682,0z M102.113,100.814l-21.018,16.01
                      l21.018,6.261V100.814z M112.678,65.975h0.007H112.678v-0.013l-0.006,0.007L86.815,48.171l-4.039,26.174h19.336l10.492,9.95
                      C112.604,84.295,112.678,65.975,112.678,65.975z"/>
                    <path fill="#E34807" d="M39.868,123.085l-30.569,9.106L0,100.814h39.868C39.868,100.814,39.868,123.085,39.868,123.085z
                      M59.205,74.338l5.839,37.84l-8.093-21.04L29.37,84.295l10.491-9.956h19.344L59.205,74.338z M102.112,123.085l30.57,9.106
                      l9.299-31.378h-39.869C102.112,100.814,102.112,123.085,102.112,123.085z M82.776,74.338l-5.839,37.84l8.092-21.04l27.583-6.843
                      l-10.498-9.956H82.776V74.338z"/>
                    <path fill="#FF8D5D" d="M0,100.801l9.299-34.839h19.997l0.073,18.327l27.584,6.843l8.092,21.039l-4.16,4.633l-21.017-16.01H0
                      V100.801z M141.981,100.801l-9.299-34.839h-19.998l-0.073,18.327l-27.582,6.843l-8.093,21.039l4.159,4.633l21.018-16.01h39.868
                      V100.801z M84.915,28.538h-27.85l-1.891,19.599l9.872,64.013h11.891l9.878-64.013L84.915,28.538z"/>
                    <path fill="#661800" d="M9.299,0L0,36.507l9.299,29.455h19.997l25.87-17.804L9.299,0z M53.426,81.938h-9.059l-4.932,4.835
                      l17.524,4.344l-3.533-9.186V81.938z M132.682,0l9.299,36.507l-9.299,29.455h-19.998L86.815,48.158L132.682,0z M88.568,81.938h9.072
                      l4.932,4.841l-17.544,4.353l3.54-9.201V81.938z M79.029,124.385l2.067-7.567l-4.16-4.633h-11.9l-4.159,4.633l2.066,7.567"/>
                    <path fill="#C0C4CD" d="M79.029,124.384v12.495H62.945v-12.495L79.029,124.384L79.029,124.384z"/>
                    <path fill="#E7EBF6" d="M39.875,123.072l23.083,13.8v-12.495l-2.067-7.566C60.891,116.811,39.875,123.072,39.875,123.072z
                      M102.113,123.072l-23.084,13.8v-12.495l2.067-7.566C81.096,116.811,102.113,123.072,102.113,123.072z"/>
                  </svg>
                </div>
                <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>MetaMask</span>
              </div>
              <span style={{ color: colors.secondaryTextColor, fontSize: '12px' }}>Coming Soon</span>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Popup */}
      {showDashboard && connected && (
        <div 
          ref={dashboardRef}
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            marginTop: '8px',
            backgroundColor: colors.dropdownBackground,
            border: 'none',
            borderRadius: '0px', // Harsh 90 degree edges
            padding: '20px',
            width: '336px', // 20% wider (280 * 1.2)
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
          }}
        >
          {/* Wallet Address Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            marginBottom: '16px' // Reduced from 20px
          }}>
            {/* Phantom Icon */}
            <div style={{
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 1200 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_2596_138588)">
                  <rect width="1200" height="1200" rx="257.592" fill="#AB9FF2"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M517.219 779.814C470.102 852.012 391.148 943.378 286.09 943.378C236.426 943.378 188.672 922.933 188.672 834.122C188.672 607.943 497.48 257.813 784.004 257.813C947.004 257.813 1011.95 370.902 1011.95 499.326C1011.95 664.168 904.98 852.651 798.648 852.651C764.902 852.651 748.347 834.122 748.347 804.732C748.347 797.065 749.621 788.759 752.168 779.814C715.875 841.789 645.836 899.292 580.254 899.292C532.5 899.292 508.305 869.263 508.305 827.094C508.305 811.76 511.488 795.787 517.219 779.814ZM904.363 494.869C904.363 532.291 882.284 551.002 857.586 551.002C832.514 551.002 810.809 532.291 810.809 494.869C810.809 457.448 832.514 438.737 857.586 438.737C882.284 438.737 904.363 457.448 904.363 494.869ZM764.031 494.871C764.031 532.293 741.952 551.004 717.254 551.004C692.182 551.004 670.477 532.293 670.477 494.871C670.477 457.449 692.182 438.739 717.254 438.739C741.952 438.739 764.031 457.449 764.031 494.871Z" fill="#FFFDF8"/>
                </g>
                <defs>
                  <clipPath id="clip0_2596_138588">
                    <rect width="1200" height="1200" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
            {/* Wallet ID */}
            <span style={{ 
              color: 'white', 
              fontSize: '14px'
            }}>
              {formattedAddress || address}
            </span>
            {/* Copy Icon - directly after wallet ID */}
            <button 
              onClick={() => navigator.clipboard.writeText(address || '')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: colors.secondaryTextColor,
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          {/* Total Funds Box */}
          <div style={{
            width: '90%',
            border: '1px solid #444', // Lighter grey thin line
            borderRadius: '0px', // Harsh 90 degree edges
            padding: '12px', // Reduced from 16px
            marginBottom: '10px', // Reduced from 12px
            backgroundColor: 'transparent'
          }}>
            <div style={{ color: colors.secondaryTextColor, fontSize: '12px', marginBottom: '6px' }}> {/* Reduced from 8px */}
              Total funds
            </div>
            <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
              Balance Coming Soon
            </div>
          </div>

          {/* View on Explorer */}
          <button 
            onClick={() => window.open(`https://explorer.solana.com/address/${address}`, '_blank')}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white', // Changed to white to make it clear it's a button
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              padding: '10px 0', // Reduced from 12px
              marginBottom: '6px', // Reduced from 8px
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {/* Explorer Icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.68675 15.6451L4.59494 14.5435C4.6983 14.4839 4.8196 14.4631 4.9369 14.4851L8.6914 15.1878C8.99995 15.2455 9.28478 15.008 9.28338 14.6941L9.26876 11.4045C9.26836 11.3151 9.29193 11.2272 9.33701 11.15L11.2317 7.90621C11.3303 7.73739 11.3215 7.52658 11.2091 7.3666L8.01892 2.82568M19.0002 4.85905C13.5002 7.50004 16.5 11 17.5002 11.5C19.3773 12.4384 21.9876 12.5 21.9876 12.5C21.9958 12.3344 22 12.1677 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C12.1677 22 12.3344 21.9959 12.5 21.9877M16.7578 21.9398L13.591 13.591L21.9398 16.7578L18.2376 18.2376L16.7578 21.9398Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View on Explorer
          </button>

          {/* Disconnect */}
          <button 
            onClick={handleDisconnect}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white', // Changed to white to make it clear it's a button
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              padding: '10px 0', // Reduced from 12px
              margin: '0', // Ensure no margins that could create lines
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {/* Power/Disconnect Icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.0001 2V12M18.3601 6.64C19.6185 7.89879 20.4754 9.50244 20.8224 11.2482C21.1694 12.9939 20.991 14.8034 20.3098 16.4478C19.6285 18.0921 18.4749 19.4976 16.9949 20.4864C15.515 21.4752 13.775 22.0029 11.9951 22.0029C10.2152 22.0029 8.47527 21.4752 6.99529 20.4864C5.51532 19.4976 4.36176 18.0921 3.68049 16.4478C2.99921 14.8034 2.82081 12.9939 3.16784 11.2482C3.51487 9.50244 4.37174 7.89879 5.63012 6.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Disconnect
          </button>
        </div>
      )}

    </div>
  );
};
