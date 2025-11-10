import React, { useState, useEffect, useRef } from 'react';
import { colors } from '../../../theme';

// Contract types and interfaces
export type OptionType = 'call' | 'put';
export type ExpiryTimeframe = '1d' | '3d' | '7d' | '14d' | '30d';

export interface OptionContract {
  id: string; // Unique identifier for backend/Solana contract
  type: OptionType;
  asset: string; // e.g., "WIF", "BONK"
  strikePrice: number;
  expiryTimestamp: number; // Unix timestamp
  premium: number; // Price to buy the contract
  markPrice: number;
  volume24h: number;
  openInterest: number;
  availableLiquidity: number;
  maxSize: number; // Maximum contract size available
  contractAddress?: string; // Solana program address
  vaultAddress?: string; // Vault that backs this contract
  impliedVolatility?: number;
  delta?: number;
  gamma?: number;
  theta?: number;
}

interface TradingDashboardProps {
  selectedAsset: string; // Current asset symbol (e.g., "WIF")
  currentPrice: number; // Current market price for the asset
  priceChange24h?: number; // 24h price change percentage (e.g., -5.5 for -5.5%)
  onBuyContract?: (contractId: string) => void; // Callback when user wants to buy
}

const EXPIRY_OPTIONS: { value: ExpiryTimeframe; label: string }[] = [
  { value: '1d', label: '1 Day' },
  { value: '3d', label: '3 Days' },
  { value: '7d', label: '7 Days' },
  { value: '14d', label: '14 Days' },
  { value: '30d', label: '30 Days' },
];

export const TradingDashboard: React.FC<TradingDashboardProps> = ({
  selectedAsset,
  currentPrice,
  priceChange24h = 0,
  onBuyContract,
}) => {
  const [optionType, setOptionType] = useState<OptionType>('call');
  const [selectedExpiry, setSelectedExpiry] = useState<ExpiryTimeframe>('1d');
  const [selectedContract, setSelectedContract] = useState<OptionContract | null>(null);
  const [contracts, setContracts] = useState<OptionContract[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleExpiryCount, setVisibleExpiryCount] = useState(5); // Start with all 5 visible
  const expiryContainerRef = useRef<HTMLDivElement>(null);
  const [purchasedContract, setPurchasedContract] = useState<OptionContract | null>(null); // For post-purchase popup

  // Generate expiry timestamp from timeframe
  const getExpiryTimestamp = (timeframe: ExpiryTimeframe): number => {
    const days = timeframe === '1d' ? 1 : timeframe === '3d' ? 3 : timeframe === '7d' ? 7 : timeframe === '14d' ? 14 : 30;
    const now = Date.now();
    return now + (days * 24 * 60 * 60 * 1000);
  };

  // Clear selected contract when switching options/expiry
  useEffect(() => {
    setSelectedContract(null);
  }, [optionType, selectedExpiry, selectedAsset]);

  // Helper function to generate a contract
  const generateContract = (
    strikePrice: number,
    index: number,
    expiryTimestamp: number,
    asset: string,
    type: OptionType,
    expiry: ExpiryTimeframe,
    price: number
  ): OptionContract => {
    const CONTRACTS_PER_UNIT = 1000;
    
    // Calculate intrinsic value PER TOKEN
    const intrinsicValuePerToken = type === 'call'
      ? Math.max(0, price - strikePrice)
      : Math.max(0, strikePrice - price);
    
    // Calculate time value PER TOKEN
    const daysToExpiry = parseInt(expiry.replace('d', ''));
    const volatility = 0.6;
    const timeDecay = Math.sqrt(daysToExpiry / 365);
    
    const moneyness = type === 'call'
      ? (price / strikePrice)
      : (strikePrice / price);
    
    const distanceFromATM = Math.abs(1 - moneyness);
    const baseTimeValuePerToken = price * volatility * timeDecay * 0.1;
    const timeValueMultiplier = Math.max(0.3, 1 - (distanceFromATM * 0.5));
    const timeValuePerToken = baseTimeValuePerToken * timeValueMultiplier;
    
    const premiumPerToken = Math.max(
      intrinsicValuePerToken + timeValuePerToken,
      price * 0.02
    );
    
    const premium = premiumPerToken * CONTRACTS_PER_UNIT;
    
    return {
      id: `${asset}-${type}-${expiry}-${strikePrice.toFixed(2)}-${expiryTimestamp}`,
      type: type,
      asset: asset,
      strikePrice: strikePrice,
      expiryTimestamp: expiryTimestamp,
      premium: premium,
      markPrice: premium * 1.01, // Mark price is slightly above premium (current market value of option)
      volume24h: Math.random() * 100000 + 5000,
      openInterest: Math.random() * 50000 + 1000,
      availableLiquidity: Math.random() * 500000 + 10000,
      maxSize: Math.floor(Math.random() * 1000 + 100),
      contractAddress: `Contract${index}${Date.now()}`,
      vaultAddress: `Vault${asset}`,
      impliedVolatility: Math.random() * 0.5 + 0.3,
      delta: type === 'call' 
        ? Math.max(0, Math.min(1, (price - strikePrice) / (price * 0.2)))
        : Math.max(-1, Math.min(0, -(price - strikePrice) / (price * 0.2))),
      gamma: Math.random() * 0.01,
      theta: -premium * 0.05,
    };
  };

  // Full contract regeneration when option type/expiry/asset changes
  useEffect(() => {
    const expiryTimestamp = getExpiryTimestamp(selectedExpiry);
    
    setIsLoading(true);
    
    const timeout = setTimeout(() => {
      const generatedContracts: OptionContract[] = [];
      const strikeMultipliers = [0.90, 0.95, 1.0, 1.05, 1.10, 1.15, 1.20];
      
      strikeMultipliers.forEach((multiplier, index) => {
        const strikePrice = currentPrice * multiplier;
        const contract = generateContract(
          strikePrice,
          index,
          expiryTimestamp,
          selectedAsset,
          optionType,
          selectedExpiry,
          currentPrice
        );
        generatedContracts.push(contract);
      });
      
      setContracts(generatedContracts);
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [selectedAsset, optionType, selectedExpiry]); // NOT currentPrice

  // Update premiums when price changes (without regenerating contracts)
  useEffect(() => {
    if (contracts.length === 0) return;
    
    setContracts(prevContracts => {
      return prevContracts.map((contract, index) => {
        const strikeMultipliers = [0.90, 0.95, 1.0, 1.05, 1.10, 1.15, 1.20];
        const multiplier = strikeMultipliers[index];
        const newStrikePrice = currentPrice * multiplier;
        
        // Regenerate contract with new price (but keep same structure)
        return generateContract(
          newStrikePrice,
          index,
          contract.expiryTimestamp,
          contract.asset,
          contract.type,
          selectedExpiry,
          currentPrice
        );
      });
    });
  }, [currentPrice]); // Only update when price changes

  const handleContractClick = (contract: OptionContract) => {
    setSelectedContract(contract);
  };

  const handleBuyContract = (contractId: string) => {
    const contract = selectedContract;
    if (!contract) return;
    
    if (onBuyContract) {
      onBuyContract(contractId);
    }
    // In production, this would trigger wallet connection, transaction signing, etc.
    // After Phantom signature is approved and Solana program executes, show popup
    console.log('Buying contract:', contractId);
    
    // For now, show popup immediately. Later this will only show after successful transaction
    setPurchasedContract(contract);
    setSelectedContract(null); // Close detail view
  };

  const formatTimeRemaining = (timestamp: number): string => {
    const now = Date.now();
    const diff = timestamp - now;
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
    });
  };

  const formatExpiryDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
    });
  };

  // Calculate breakeven price for call/put
  const calculateBreakeven = (strikePrice: number, premium: number, type: OptionType): number => {
    if (type === 'call') {
      return strikePrice + (premium / 1000); // Premium per token, added to strike
    } else {
      return strikePrice - (premium / 1000); // Premium per token, subtracted from strike
    }
  };

  // Calculate breakeven percentage
  const calculateBreakevenPercentage = (breakeven: number, currentPrice: number, type: OptionType): number => {
    if (type === 'call') {
      return ((breakeven - currentPrice) / currentPrice) * 100;
    } else {
      return ((currentPrice - breakeven) / currentPrice) * 100;
    }
  };

  const isInTheMoney = (contract: OptionContract, currentPrice: number): boolean => {
    if (contract.type === 'call') {
      return currentPrice > contract.strikePrice;
    } else {
      return currentPrice < contract.strikePrice;
    }
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxHeight: '100%',
    backgroundColor: colors.mainSectionColor,
    overflow: 'hidden',
    minHeight: 0, // Important for flex children to respect parent constraints
  };

  const headerStyles: React.CSSProperties = {
    padding: '1rem',
    borderBottom: `1px solid ${colors.mainBorderColor}`,
    backgroundColor: colors.mainSectionColor,
    flexShrink: 0, // Prevent header from shrinking
  };

  // Option Type Toggle
  const toggleContainerStyles: React.CSSProperties = {
    display: 'flex',
    backgroundColor: colors.mainSectionColor,
    borderRadius: 0,
    padding: 'clamp(2px, 0.3vw, 3px)',
    border: `1px solid ${colors.mainBorderColor}`,
    marginBottom: '1rem',
    flexShrink: 0,
  };

  const toggleButtonStyles = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: 'clamp(0.3rem, 1vw, 0.5rem) clamp(0.6rem, 1.5vw, 0.9rem)',
    backgroundColor: isActive ? colors.mainAccentColor : colors.mainSectionColor,
    color: isActive ? colors.buttonTextColor : colors.secondaryTextColor,
    border: 'none',
    borderRadius: 0,
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
    transition: 'all 0.2s ease',
  });

  // Calculate visible expiry buttons based on container width
  useEffect(() => {
    const updateVisibleExpiryCount = () => {
      if (!expiryContainerRef.current) return;
      
      const container = expiryContainerRef.current;
      const containerWidth = container.offsetWidth;
      const gap = 8; // 0.4rem = ~8px
      const minButtonWidth = 55; // Minimum width per button
      
      // Calculate how many buttons can fit
      let maxButtons = Math.floor((containerWidth + gap) / (minButtonWidth + gap));
      
      // Ensure at least 1 button is visible, and max 5
      maxButtons = Math.max(1, Math.min(5, maxButtons));
      
      setVisibleExpiryCount(maxButtons);
    };

    // Initial calculation
    const timeoutId = setTimeout(updateVisibleExpiryCount, 0);
    
    // Update on resize
    window.addEventListener('resize', updateVisibleExpiryCount);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateVisibleExpiryCount);
    };
  }, []);

  // Expiry Selection
  const expiryContainerStyles: React.CSSProperties = {
    display: 'flex',
    gap: 0,
    flexWrap: 'nowrap', // Never wrap
    width: '100%',
    border: `1px solid ${colors.mainBorderColor}`,
  };

  const expiryButtonStyles = (isActive: boolean, isFirst: boolean): React.CSSProperties => ({
    flex: 1, // Make buttons equal width and fill container
    padding: '0.4rem 0.5rem',
    backgroundColor: isActive ? colors.mainAccentColor : colors.mainSectionColor,
    color: isActive ? colors.buttonTextColor : colors.secondaryTextColor,
    border: 'none',
    borderLeft: isFirst ? 'none' : `1px solid ${colors.mainBorderColor}`,
    borderRadius: 0,
    cursor: 'pointer',
    fontWeight: isActive ? '600' : '400',
    fontSize: '0.75rem',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    minWidth: 0, // Allow buttons to shrink if needed
    textAlign: 'center',
  });

  // Contracts List
  const contractsListStyles: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '0.5rem',
    minHeight: 0, // Important for scrolling to work in flex containers
  };

  // Contract Detail View Styles
  const detailViewStyles: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '1rem',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  };

  const backButtonStyles: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.secondaryTextColor,
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '0.5rem',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    transition: 'color 0.2s ease',
    borderRadius: '4px',
  };

  const fixedBuyButtonContainerStyles: React.CSSProperties = {
    flexShrink: 0, // Don't shrink
    backgroundColor: colors.mainSectionColor,
    borderTop: `1px solid ${colors.mainBorderColor}`,
    padding: '1rem',
  };

  const fixedBuyButtonStyles: React.CSSProperties = {
    width: '100%',
    padding: '1rem',
    backgroundColor: colors.successColor,
    color: colors.buttonTextColor,
    border: 'none',
    borderRadius: 0,
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  };

  const contractCardStyles: React.CSSProperties = {
    backgroundColor: 'transparent',
    borderBottom: `1px solid ${colors.mainBorderColor}`,
    borderRadius: 0,
    padding: '1rem 0.75rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  const strikePriceStyles: React.CSSProperties = {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: colors.mainTextColor,
    marginBottom: '0.5rem',
  };

  const breakevenLabelStyles: React.CSSProperties = {
    fontSize: '0.75rem',
    color: colors.secondaryTextColor,
    marginBottom: '0.25rem',
  };

  const breakevenPriceStyles: React.CSSProperties = {
    fontSize: '0.85rem',
    color: colors.mainTextColor,
    fontWeight: '500',
    marginBottom: '0.25rem',
  };

  const premiumOvalStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px solid ${colors.mainAccentColor}`,
    borderRadius: '50px',
    padding: '0.4rem 0.75rem',
    backgroundColor: 'transparent',
    minHeight: '32px',
  };

  const premiumValueStyles: React.CSSProperties = {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: colors.mainAccentColor,
    lineHeight: 1,
  };

  const getPriceChange24hStyles = (change: number): React.CSSProperties => ({
    fontSize: '0.75rem',
    color: change >= 0 ? colors.successColor : colors.mainAccentColor,
    marginTop: '0.25rem',
  });


  const detailRowStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: `1px solid ${colors.mainBorderColor}`,
  };

  const detailLabelStyles: React.CSSProperties = {
    color: colors.secondaryTextColor,
    fontSize: '0.85rem',
  };

  const detailValueStyles: React.CSSProperties = {
    color: colors.mainTextColor,
    fontSize: '0.85rem',
    fontWeight: '500',
    textAlign: 'right',
  };

  const detailTitleStyles: React.CSSProperties = {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: colors.mainTextColor,
    marginBottom: '0.5rem',
  };

  // Purchase Confirmation Popup Styles - Ticket Design
  const popupOverlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const popupContentStyles: React.CSSProperties = {
    backgroundColor: colors.mainSectionColor,
    border: 'none',
    borderRadius: 0,
    padding: 0,
    maxWidth: '320px',
    width: '85%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxShadow: `0 0 30px rgba(255, 255, 255, 0.15)`,
  };

  // Ticket header with logo and title
  const popupHeaderStyles: React.CSSProperties = {
    backgroundColor: colors.mainSectionColor,
    borderBottom: `1px solid ${colors.mainBorderColor}`,
    padding: '1rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const popupLogoStyles: React.CSSProperties = {
    width: '36px',
    height: '36px',
  };

  const popupTitleStyles: React.CSSProperties = {
    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
    fontWeight: '500',
    color: colors.mainTextColor,
    margin: 0,
    letterSpacing: '0.01em',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const popupSubtitleStyles: React.CSSProperties = {
    fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
    color: colors.secondaryTextColor,
    marginTop: '0.25rem',
    fontWeight: '400',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const popupBodyStyles: React.CSSProperties = {
    padding: '1rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  };

  // Ticket-style divider
  const ticketDividerStyles: React.CSSProperties = {
    height: '1px',
    backgroundColor: colors.mainBorderColor,
    margin: '0.75rem 0',
    border: 'none',
  };

  const popupRowStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.6rem 0',
    borderBottom: `1px solid ${colors.mainBorderColor}40`,
  };

  const popupLabelStyles: React.CSSProperties = {
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    color: colors.secondaryTextColor,
    fontWeight: '400',
    letterSpacing: '0.01em',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    textTransform: 'none',
  };

  const popupValueStyles: React.CSSProperties = {
    fontSize: 'clamp(0.8rem, 2vw, 0.95rem)',
    fontWeight: '500',
    color: colors.mainTextColor,
    letterSpacing: '0.01em',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const popupStatusStyles = (isITM: boolean): React.CSSProperties => ({
    fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
    fontWeight: '500',
    color: isITM ? colors.successColor : colors.secondaryTextColor,
    letterSpacing: '0.01em',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    textTransform: 'none',
  });

  // Ticket footer
  const popupFooterStyles: React.CSSProperties = {
    borderTop: `1px solid ${colors.mainBorderColor}40`,
    padding: '1rem 1.25rem',
    backgroundColor: colors.mainSectionColor,
  };

  const popupCloseButtonStyles: React.CSSProperties = {
    width: '100%',
    padding: 'clamp(0.75rem, 2vw, 1rem)',
    backgroundColor: colors.mainAccentColor,
    color: colors.buttonTextColor,
    border: 'none',
    borderRadius: 0,
    cursor: 'pointer',
    fontSize: 'clamp(0.8rem, 2vw, 0.95rem)',
    fontWeight: '500',
    letterSpacing: '0.01em',
    transition: 'all 0.2s ease',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  return (
    <div style={containerStyles}>
      {/* Header with Controls - Only show when no contract is selected */}
      {!selectedContract && (
        <div style={headerStyles}>
          {/* Option Type Toggle */}
          <div style={toggleContainerStyles}>
            <button
              style={toggleButtonStyles(optionType === 'call')}
              onClick={() => setOptionType('call')}
            >
              Call Options
            </button>
            <button
              style={toggleButtonStyles(optionType === 'put')}
              onClick={() => setOptionType('put')}
            >
              Put Options
            </button>
          </div>

        {/* Expiry Selection */}
        <div ref={expiryContainerRef} style={expiryContainerStyles}>
          {EXPIRY_OPTIONS.slice(0, visibleExpiryCount).map((option, index) => (
            <button
              key={option.value}
              style={expiryButtonStyles(selectedExpiry === option.value, index === 0)}
              onClick={() => setSelectedExpiry(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        </div>
      )}

      {selectedContract ? (
        <>
          {/* Contract Detail View */}
          <div style={detailViewStyles}>
            {/* Back Button */}
            <button
              style={backButtonStyles}
              onClick={() => setSelectedContract(null)}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.mainTextColor;
                e.currentTarget.style.backgroundColor = colors.tabInactiveBackground;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.secondaryTextColor;
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Contract Title */}
            <h3 style={detailTitleStyles}>
              Buy {selectedContract.asset} ${selectedContract.strikePrice.toFixed(2)} {selectedContract.type === 'call' ? 'Call' : 'Put'} {formatExpiryDate(selectedContract.expiryTimestamp)}
            </h3>

            {/* Premium - In same format as other details */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: colors.secondaryTextColor, marginBottom: '0.5rem', fontWeight: '500' }}>
                Premium
              </div>
              <div style={detailRowStyles}>
                <span style={detailLabelStyles}>Cost</span>
                <span style={{ ...detailValueStyles, fontWeight: '700' }}>
                  ${selectedContract.premium.toFixed(2)}
                </span>
              </div>
              <div style={detailRowStyles}>
                <span style={detailLabelStyles}>Contract Size</span>
                <span style={detailValueStyles}>
                  1,000 tokens
                </span>
              </div>
            </div>

            {/* Breakeven Section */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: colors.secondaryTextColor, marginBottom: '0.5rem', fontWeight: '500' }}>
                Breakeven
              </div>
              <div style={detailRowStyles}>
                <span style={detailLabelStyles}>Breakeven Price</span>
                <span style={detailValueStyles}>
                  ${calculateBreakeven(selectedContract.strikePrice, selectedContract.premium, selectedContract.type).toFixed(2)}
                </span>
              </div>
              <div style={detailRowStyles}>
                <span style={detailLabelStyles}>To Breakeven</span>
                <span style={detailValueStyles}>
                  {(() => {
                    const breakeven = calculateBreakeven(selectedContract.strikePrice, selectedContract.premium, selectedContract.type);
                    const breakevenPercent = calculateBreakevenPercentage(breakeven, currentPrice, selectedContract.type);
                    return `${breakevenPercent >= 0 ? '+' : ''}${breakevenPercent.toFixed(2)}%`;
                  })()}
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: colors.secondaryTextColor, marginBottom: '0.5rem', fontWeight: '500' }}>
                Pricing
              </div>
              <div style={detailRowStyles}>
                <span style={detailLabelStyles}>Strike Price</span>
                <span style={detailValueStyles}>${selectedContract.strikePrice.toFixed(2)}</span>
              </div>
              <div style={detailRowStyles}>
                <span style={detailLabelStyles}>Current Price</span>
                <span style={detailValueStyles}>${currentPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Expiry Section */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: colors.secondaryTextColor, marginBottom: '0.5rem', fontWeight: '500' }}>
                Expiry
              </div>
              <div style={detailRowStyles}>
                <span style={detailLabelStyles}>Time Remaining</span>
                <span style={detailValueStyles}>{formatTimeRemaining(selectedContract.expiryTimestamp)}</span>
              </div>
              <div style={detailRowStyles}>
                <span style={detailLabelStyles}>Expires</span>
                <span style={detailValueStyles}>{formatDate(selectedContract.expiryTimestamp)}</span>
              </div>
            </div>

            {/* Market Activity */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.75rem', color: colors.secondaryTextColor, marginBottom: '0.5rem', fontWeight: '500' }}>
                Market Activity
              </div>
              <div style={detailRowStyles}>
                <span style={detailLabelStyles}>24h Volume</span>
                <span style={detailValueStyles}>${selectedContract.volume24h.toLocaleString()}</span>
              </div>
              <div style={detailRowStyles}>
                <span style={detailLabelStyles}>Open Interest</span>
                <span style={detailValueStyles}>${selectedContract.openInterest.toLocaleString()}</span>
              </div>
              <div style={detailRowStyles}>
                <span style={detailLabelStyles}>Max Contracts</span>
                <span style={detailValueStyles}>{selectedContract.maxSize}</span>
              </div>
            </div>
          </div>

          {/* Fixed Buy Button at Bottom */}
          <div style={fixedBuyButtonContainerStyles}>
            <button
              style={fixedBuyButtonStyles}
              onClick={() => handleBuyContract(selectedContract.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.successBright;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.successColor;
              }}
            >
              Buy Contract - ${selectedContract.premium.toFixed(2)}
            </button>
          </div>
        </>
      ) : (
        /* Contracts List */
        <div style={contractsListStyles}>
          {isLoading && contracts.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: colors.secondaryTextColor }}>
              Loading contracts...
            </div>
          ) : contracts.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: colors.secondaryTextColor }}>
              No contracts available
            </div>
          ) : (
            contracts.map((contract) => {
              const breakeven = calculateBreakeven(contract.strikePrice, contract.premium, contract.type);
              const breakevenPercent = calculateBreakevenPercentage(breakeven, currentPrice, contract.type);
              
              return (
                <div
                  key={contract.id}
                  style={contractCardStyles}
                  onClick={() => handleContractClick(contract)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.tabInactiveBackground;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    {/* Left Side: Strike, Breakeven Info */}
                    <div style={{ flex: 1 }}>
                      <div style={strikePriceStyles}>
                        ${contract.strikePrice.toFixed(2)}
                      </div>
                      <div style={{ marginTop: '0.25rem' }}>
                        {/* Text Row */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.25rem' }}>
                          <div style={{ ...breakevenLabelStyles, minWidth: '80px' }}>Breakeven</div>
                          <div style={{ fontSize: '0.7rem', color: colors.secondaryTextColor, minWidth: '90px' }}>
                            To breakeven
                          </div>
                        </div>
                        {/* Numbers Row */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                          <div style={{ ...breakevenPriceStyles, minWidth: '80px' }}>
                            ${breakeven.toFixed(2)}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: colors.mainTextColor, fontWeight: '500', minWidth: '90px' }}>
                            {breakevenPercent >= 0 ? '+' : ''}{breakevenPercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Premium and 24h Movement */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      {/* Premium Oval */}
                      <div style={premiumOvalStyles}>
                        <span style={premiumValueStyles}>
                          ${contract.premium.toFixed(2)}
                        </span>
                      </div>
                      
                      {/* 24h Price Movement */}
                      <div style={getPriceChange24hStyles(priceChange24h)}>
                        <span style={{ fontWeight: '600' }}>
                          {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
                        </span>
                        <span style={{ color: colors.mainTextColor, marginLeft: '0.25rem' }}>Today</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Purchase Confirmation Popup - Ticket Style */}
      {purchasedContract && (
        <div 
          style={popupOverlayStyles}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setPurchasedContract(null);
            }
          }}
        >
          <div style={popupContentStyles}>
            {/* Ticket Header with Logo */}
            <div style={popupHeaderStyles}>
              <img 
                src="/icons/logo.svg" 
                alt="ArcadeX Logo" 
                style={popupLogoStyles}
              />
              <h2 style={popupTitleStyles}>Order Filled</h2>
              <p style={popupSubtitleStyles}>
                Contract Purchased Successfully
              </p>
            </div>

            {/* Ticket Body */}
            <div style={popupBodyStyles}>
              <div style={popupRowStyles}>
                <span style={popupLabelStyles}>Asset</span>
                <span style={popupValueStyles}>
                  ${purchasedContract.asset}
                </span>
              </div>

              <div style={popupRowStyles}>
                <span style={popupLabelStyles}>Contract Type</span>
                <span style={popupValueStyles}>
                  {purchasedContract.type === 'call' ? 'Call' : 'Put'} Option
                </span>
              </div>

              <hr style={ticketDividerStyles} />

              <div style={popupRowStyles}>
                <span style={popupLabelStyles}>Strike Price</span>
                <span style={popupValueStyles}>
                  ${purchasedContract.strikePrice.toFixed(2)}
                </span>
              </div>

              <div style={popupRowStyles}>
                <span style={popupLabelStyles}>Current Price</span>
                <span style={popupValueStyles}>
                  ${currentPrice.toFixed(2)}
                </span>
              </div>

              <div style={popupRowStyles}>
                <span style={popupLabelStyles}>Premium Paid</span>
                <span style={popupValueStyles}>
                  ${purchasedContract.premium.toFixed(2)}
                </span>
              </div>

              <div style={popupRowStyles}>
                <span style={popupLabelStyles}>Breakeven Price</span>
                <span style={popupValueStyles}>
                  ${calculateBreakeven(purchasedContract.strikePrice, purchasedContract.premium, purchasedContract.type).toFixed(2)}
                </span>
              </div>

              <hr style={ticketDividerStyles} />

              <div style={popupRowStyles}>
                <span style={popupLabelStyles}>Status</span>
                <span style={popupStatusStyles(isInTheMoney(purchasedContract, currentPrice))}>
                  {isInTheMoney(purchasedContract, currentPrice) ? 'In The Money (ITM)' : 'Out of The Money (OTM)'}
                </span>
              </div>
            </div>

            {/* Ticket Footer */}
            <div style={popupFooterStyles}>
              <button
                style={popupCloseButtonStyles}
                onClick={() => setPurchasedContract(null)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.mainAccentColor;
                  e.currentTarget.style.boxShadow = `0 0 25px ${colors.mainAccentColor}50`;
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.mainAccentColor;
                  e.currentTarget.style.boxShadow = `0 0 15px ${colors.mainAccentColor}30`;
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

