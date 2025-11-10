import React, { useState, useEffect, useRef } from 'react';
import { colors } from '../../theme';
import { TradingViewChart, TradingDashboard } from '../../components/features';

interface MemecoinPair {
  name: string;
  symbol: string;
  display: string;
  logo: string;
}

const MEMECOIN_PAIRS: MemecoinPair[] = [
  { name: "WIF", symbol: "BINANCE:WIFUSDT", display: "WIFUSDT", logo: "https://assets.coingecko.com/coins/images/33566/small/dogwifhat.jpg" },
  { name: "BONK", symbol: "BINANCE:BONKUSDT", display: "BONKUSDT", logo: "https://assets.coingecko.com/coins/images/28600/small/bonk.jpg" },
  { name: "POPCAT", symbol: "BYBIT:POPCATUSDT", display: "POPCATUSDT", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/28782.png" },
  { name: "PNUT", symbol: "BINANCE:PNUTUSDT", display: "PNUTUSDT", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/33788.png" },
  { name: "MOODENG", symbol: "OKX:MOODENGUSDT", display: "MOODENGUSDT", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/33093.png" },
  { name: "FARTCOIN", symbol: "GATEIO:FARTCOINUSDT", display: "FARTCOINUSDT", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/33597.png" },
  { name: "TROLL", symbol: "MEXC:TROLLUSDT", display: "TROLLUSDT", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/36313.png" }
];

interface TickerItem {
  symbol: string; // Unique identifier for backend mapping (e.g., "WIF", "BONK")
  name: string;
  price: number;
  change24h: number;
}

export const Exchange: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState<MemecoinPair>(MEMECOIN_PAIRS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0.5); // Mock price - should come from API/oracle
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const isMobileView = windowWidth <= 800; // Hide chart/positions below 800px
  
  // Ticker data - structured by symbol for easy backend mapping
  const [tickerData, setTickerData] = useState<Record<string, TickerItem>>({});

  // Initialize ticker data with mock prices - structured by symbol
  // In production, this would be: setTickerData(await fetchMarketData())
  useEffect(() => {
    const initialData: Record<string, TickerItem> = {};
    
    MEMECOIN_PAIRS.forEach(pair => {
      initialData[pair.name] = {
        symbol: pair.name, // Use as key for easy backend mapping
        name: pair.name,
        price: Math.random() * 2 + 0.1, // Random price between 0.1 and 2.1
        change24h: (Math.random() * 20) - 10, // Random change between -10% and +10%
      };
    });
    
    setTickerData(initialData);
    
    // Update ticker prices periodically
    // In production: fetchMarketData() would update this
    const interval = setInterval(() => {
      setTickerData(prev => {
        const updated: Record<string, TickerItem> = {};
        MEMECOIN_PAIRS.forEach(pair => {
          updated[pair.name] = {
            ...prev[pair.name],
            price: (prev[pair.name]?.price || 1) * (0.98 + Math.random() * 0.04),
            change24h: (Math.random() * 20) - 10,
          };
        });
        return updated;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Example function structure for backend integration:
  // const updateTickerData = async () => {
  //   const marketData = await fetch('/api/market-data'); // Backend endpoint
  //   const updated: Record<string, TickerItem> = {};
  //   marketData.forEach((item: { symbol: string; price: number; change24h: number }) => {
  //     updated[item.symbol] = {
  //       symbol: item.symbol,
  //       name: item.symbol,
  //       price: item.price,
  //       change24h: item.change24h,
  //     };
  //   });
  //   setTickerData(updated);
  // };

  // Mock price fetching - replace with actual API call
  useEffect(() => {
    // In production, fetch real price from oracle/API
    // For now, generate a mock price
    const mockPrice = Math.random() * 2 + 0.1; // Random price between 0.1 and 2.1
    setCurrentPrice(mockPrice);
    
    // Simulate price updates every 5 seconds
    const interval = setInterval(() => {
      const newPrice = mockPrice * (0.95 + Math.random() * 0.1); // Slight variation
      setCurrentPrice(newPrice);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [selectedToken]);

  const handleBuyContract = (contractId: string) => {
    // This will be called when user clicks buy
    // In production, this would:
    // 1. Check wallet connection
    // 2. Show transaction details
    // 3. Sign transaction on Solana
    // 4. Send contract ID to backend/Solana program
    console.log('Buying contract:', contractId);
    // TODO: Implement wallet integration and Solana transaction
  };

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
  return (
    <div style={{
      color: colors.mainTextColor,
      height: '100%',
      backgroundColor: colors.mainBackgroundColor,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Ticker Tape Strip - Hidden on mobile */}
      {!isMobileView && (
        <div style={{
          height: 'clamp(1.5rem, 4vh, 2rem)',
          backgroundColor: colors.mainSectionColor,
          borderTop: `1px solid ${colors.mainBorderColor}`,
          borderBottom: `1px solid ${colors.mainBorderColor}`,
          overflow: 'hidden',
          position: 'relative',
          flexShrink: 0
        }}>
          <style>{`
            @keyframes ticker-scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .ticker-content {
              display: inline-flex;
              animation: ticker-scroll 60s linear infinite;
              white-space: nowrap;
            }
            .ticker-content:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            overflow: 'hidden'
          }}>
            <div className="ticker-content" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2.5rem',
            }}>
              {/* Duplicate content for seamless loop - iterate through pairs in order */}
              {[...MEMECOIN_PAIRS, ...MEMECOIN_PAIRS].map((pair, index) => {
                const tickerItem = tickerData[pair.name];
                if (!tickerItem) return null; // Skip if data not loaded yet
                
                return (
                  <div
                    key={`${pair.name}-${index}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontSize: 'clamp(0.65rem, 1.4vw, 0.8rem)',
                    }}
                  >
                    <span style={{
                      fontWeight: '400',
                      color: colors.mainTextColor,
                    }}>
                      ${tickerItem.name}
                    </span>
                    <span style={{
                      color: colors.secondaryTextColor,
                      fontWeight: '400',
                    }}>
                      ${tickerItem.price.toFixed(4)}
                    </span>
                    <span style={{
                      color: tickerItem.change24h >= 0 ? colors.successColor : colors.mainAccentColor,
                      fontWeight: '400',
                    }}>
                      {tickerItem.change24h >= 0 ? '+' : ''}{tickerItem.change24h.toFixed(2)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        minHeight: 0,
        flexWrap: isMobileView ? 'wrap' : 'nowrap', // Allow wrapping on mobile
        flexDirection: isMobileView ? 'column' : 'row' // Stack vertically on mobile
      }}>
        {/* Left Side - Asset Info Bar (always visible), Chart and Bottom Panel (hidden on mobile) */}
        <div style={{
          flex: isMobileView ? '0 0 auto' : '1 1 400px',
          minWidth: isMobileView ? '100%' : '320px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          width: isMobileView ? '100%' : 'auto'
        }}>
          {/* Top Asset Info Bar - Always visible */}
          <div style={{
            height: 'clamp(3.5rem, 9vh, 4.5rem)',
            backgroundColor: colors.mainSectionColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'clamp(0.5rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem)',
            flexShrink: 0,
            gap: 'clamp(1rem, 3vw, 2rem)'
          }}>
            {/* Left Section: Icon + Asset Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(0.75rem, 2vw, 1.25rem)',
              flex: '1 1 auto',
              minWidth: 0
            }}>
              {/* Token Logo */}
              <img 
                src={selectedToken.logo} 
                alt={selectedToken.name}
                style={{
                  width: 'clamp(2rem, 5vw, 2.5rem)',
                  height: 'clamp(2rem, 5vw, 2.5rem)',
                  borderRadius: '50%',
                  border: `0.5px solid ${colors.mainBorderColor}`,
                  flexShrink: 0,
                  objectFit: 'cover'
                }}
              />

              {/* Asset Dropdown */}
              <div 
                ref={dropdownRef}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: 0
                }}>
                {/* Clickable Asset Name */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                    fontWeight: '600',
                    backgroundColor: 'transparent',
                    color: colors.mainTextColor,
                    border: 'none',
                    padding: 'clamp(0.25rem, 1vw, 0.5rem) clamp(1.5rem, 3vw, 2rem) clamp(0.25rem, 1vw, 0.5rem) 0',
                    cursor: 'pointer',
                    outline: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(0.5rem, 1vw, 0.75rem)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.mainAccentColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.mainTextColor;
                  }}
                >
                  {selectedToken.display}
                  <svg 
                    style={{ 
                      width: 'clamp(0.6rem, 1.5vw, 0.75rem)', 
                      height: 'clamp(0.6rem, 1.5vw, 0.75rem)', 
                      color: colors.secondaryTextColor,
                      transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }} 
                    viewBox="0 0 24 24" 
                    fill="none"
                  >
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Custom Dropdown Panel */}
                {isDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    left: '-1rem',
                    backgroundColor: colors.mainSectionColor,
                    border: `1px solid ${colors.mainBorderColor}`,
                    borderRadius: 0,
                    padding: 'clamp(0.4rem, 0.8vw, 0.5rem)',
                    minWidth: 'clamp(280px, 32vw, 400px)',
                    zIndex: 1000,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                  }}>
                    {MEMECOIN_PAIRS.map((pair) => (
                      <div
                        key={pair.symbol}
                        onClick={() => {
                          setSelectedToken(pair);
                          setIsDropdownOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: 'clamp(0.4rem, 1vw, 0.55rem) clamp(0.6rem, 1.5vw, 0.8rem)',
                          cursor: 'pointer',
                          borderRadius: 0,
                          backgroundColor: 'transparent',
                          transition: 'background-color 0.2s ease',
                          gap: 'clamp(0.6rem, 1.5vw, 0.8rem)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.inputBackground;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {/* Left: Icon + Name */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'clamp(0.4rem, 1vw, 0.6rem)',
                          flex: 1,
                          minWidth: 0
                        }}>
                          {/* Token Logo */}
                          <img 
                            src={pair.logo} 
                            alt={pair.name}
                            style={{
                              width: 'clamp(1.25rem, 3vw, 1.5rem)',
                              height: 'clamp(1.25rem, 3vw, 1.5rem)',
                              borderRadius: '50%',
                              border: `0.5px solid ${colors.mainBorderColor}`,
                              flexShrink: 0,
                              objectFit: 'cover'
                            }}
                          />
                          
                          <span style={{
                            fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)',
                            fontWeight: '600',
                            color: colors.mainTextColor
                          }}>
                            {pair.display}
                          </span>
                        </div>

                        {/* Right: 24h Change Placeholder */}
                        <div style={{
                          fontSize: 'clamp(0.7rem, 1.6vw, 0.8rem)',
                          fontWeight: '500',
                          color: colors.secondaryTextColor,
                          flexShrink: 0
                        }}>
                          {/* Will add 24h change data here */}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Section: 24h Change */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              minWidth: 'clamp(4rem, 12vw, 6rem)'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 'clamp(0.1rem, 0.3vh, 0.2rem)'
              }}>
                <span style={{
                  fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
                  color: colors.secondaryTextColor,
                  fontWeight: '500'
                }}>
                  24h change
                </span>
                {/* Placeholder for 24h change value - will be filled from backend */}
                <span style={{
                  fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                  fontWeight: '600',
                  color: colors.secondaryTextColor
                }}>
                  {/* Value will go here */}
                </span>
              </div>
            </div>
          </div>

          {/* Chart Area - Hidden on mobile */}
          {!isMobileView && (
            <div style={{
              flex: 1,
              minHeight: 0,
              backgroundColor: colors.mainSectionColor,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <TradingViewChart 
                symbol={selectedToken.symbol}
                interval="15"
                theme="dark"
                containerId="exchange-chart"
              />
            </div>
          )}

          {/* Bottom Positions/Info Panel - Hidden on mobile */}
          {!isMobileView && (
            <div style={{
              height: 'clamp(5rem, 15vh, 8rem)',
              backgroundColor: colors.mainSectionColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.secondaryTextColor,
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
              flexShrink: 0
            }}>
              Positions & Account Info
            </div>
          )}
        </div>

         {/* Dashboard Panel (Right on desktop, Below asset info on mobile) */}
         <div style={{
           width: isMobileView ? '100%' : 'clamp(320px, 28vw, 450px)',
           minWidth: isMobileView ? '100%' : '320px',
           flex: isMobileView ? '1 1 100%' : '0 0 auto',
           backgroundColor: colors.mainSectionColor,
           borderLeft: isMobileView ? 'none' : `1px solid ${colors.mainBorderColor}`,
           borderTop: isMobileView ? `1px solid ${colors.mainBorderColor}` : 'none',
           display: 'flex',
           flexDirection: 'column',
           overflow: 'hidden',
           minHeight: 0, // Important for flex children
           height: '100%', // Ensure it respects parent height
         }}>
          <TradingDashboard
            selectedAsset={selectedToken.name}
            currentPrice={currentPrice}
            priceChange24h={-5.5} // TODO: Get from actual API/oracle
            onBuyContract={handleBuyContract}
          />
        </div>
      </div>
    </div>
  );
};

