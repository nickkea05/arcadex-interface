import React, { useState, useEffect } from 'react';
import { colors } from '../../theme';

export const Cover: React.FC = () => {
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [lifetimeEarned, setLifetimeEarned] = useState<number>(0.05); // Example: positive value for dev server
  const [activeTab, setActiveTab] = useState<'covered-calls' | 'puts'>('covered-calls');
  const [actionType, setActionType] = useState<'buy' | 'sell'>('buy');
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showHowItWorks = viewportHeight >= 750;
  const showStrategyPerformance = viewportHeight >= 650;
  const showStats = viewportHeight >= 550;

  const handleQuickSelect = (amount: string) => {
    setDepositAmount(amount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers and one period
    const validNumberRegex = /^[0-9]*\.?[0-9]*$/;
    
    // Check if the value is valid (numbers and at most one period)
    if (validNumberRegex.test(value)) {
      // Count periods to ensure only one
      const periodCount = (value.match(/\./g) || []).length;
      if (periodCount <= 1) {
        setDepositAmount(value);
      }
    }
  };

  return (
    <div style={{
      color: colors.mainTextColor,
      height: '100%',
      backgroundColor: colors.mainBackgroundColor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 'clamp(0.5rem, 1.5vw, 1rem)'
    }}>
      {/* Main Vault Container */}
      <div style={{
        backgroundColor: colors.mainSectionColor,
        borderRadius: 0,
        padding: 'clamp(0.6rem, 1.5vw, 1rem)',
        width: '100%',
        maxWidth: '95vw',
        height: '100%',
        border: `1px solid ${colors.mainBorderColor}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Tab Selector */}
        <div style={{
          display: 'flex',
          backgroundColor: colors.tabInactiveBackground,
          borderRadius: 0,
          padding: 'clamp(3px, 0.5vw, 4px)',
          marginBottom: 'clamp(1rem, 2vh, 1.5rem)',
          border: `1px solid ${colors.mainBorderColor}`,
          flexShrink: 0
        }}>
          <button
            onClick={() => setActiveTab('covered-calls')}
            style={{
              flex: 1,
              padding: 'clamp(0.5rem, 1.5vw, 0.8rem) clamp(0.6rem, 2vw, 1rem)',
              backgroundColor: activeTab === 'covered-calls' ? colors.tabActiveBackground : 'transparent',
              border: 'none',
              borderRadius: 0,
              color: activeTab === 'covered-calls' ? colors.mainTextColor : colors.secondaryTextColor,
              fontSize: 'clamp(0.5rem, 2vw, 0.95rem)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0
            }}
          >
            Covered Calls
          </button>
          <button
            onClick={() => setActiveTab('puts')}
            style={{
              flex: 1,
              padding: 'clamp(0.5rem, 1.5vw, 0.8rem) clamp(0.6rem, 2vw, 1rem)',
              backgroundColor: activeTab === 'puts' ? colors.tabActiveBackground : 'transparent',
              border: 'none',
              borderRadius: 0,
              color: activeTab === 'puts' ? colors.mainTextColor : colors.secondaryTextColor,
              fontSize: 'clamp(0.5rem, 2vw, 0.95rem)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0
            }}
          >
            Covered Puts
          </button>
        </div>

        {/* Content based on active tab */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: 0 // Important for flex children to shrink
        }}>
        {activeTab === 'covered-calls' ? (
            <>
              {/* Combined Header Row with Strategy Overview and Buy/Sell Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.5rem, 2vw, 1rem)',
          marginBottom: 'clamp(0.75rem, 1.5vh, 1rem)',
          flexShrink: 0,
          flexWrap: 'wrap'
        }}>
          {/* Header Group (Icon + Title) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(0.5rem, 2vw, 1rem)',
            flex: '1 1 auto',
            minWidth: 0
          }}>
            {/* Strategy Icon */}
            <img 
              src="/icons/logo.svg" 
              alt="Logo" 
              style={{
                width: 'clamp(2.5rem, 6vw, 3.75rem)',
                height: 'clamp(2.5rem, 6vw, 3.75rem)',
                flexShrink: 0,
                objectFit: 'contain'
              }}
            />
            
            {/* Strategy Info */}
            <div style={{ flex: '1 1 auto', minWidth: 0 }}>
              <h2 style={{
                fontSize: 'clamp(1.25rem, 4vw, 2rem)',
                fontWeight: '500',
                color: colors.mainTextColor,
                margin: '0 0 clamp(0.15rem, 0.5vh, 0.25rem) 0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                Covered Calls
              </h2>
              <p style={{
                fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                color: colors.mainAccentColor,
                fontWeight: '500',
                margin: 0
              }}>
                Bet Against Call Buyers
              </p>
            </div>
          </div>

          {/* Buy/Sell Toggle */}
          <div style={{
            display: viewportWidth < 400 ? 'none' : 'flex',
            backgroundColor: colors.mainSectionColor,
            borderRadius: 0,
            padding: 'clamp(2px, 0.3vw, 3px)',
            border: `1px solid ${colors.mainBorderColor}`,
            flexShrink: 0,
            minWidth: 'clamp(120px, 25vw, 180px)'
          }}>
            <button
              onClick={() => setActionType('buy')}
              style={{
                flex: 1,
                padding: 'clamp(0.3rem, 1vw, 0.5rem) clamp(0.6rem, 1.5vw, 0.9rem)',
                backgroundColor: actionType === 'buy' ? colors.successBright : 'transparent',
                border: 'none',
                borderRadius: 0,
                color: actionType === 'buy' ? '#000000' : colors.secondaryTextColor,
                fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Buy
            </button>
            <button
              onClick={() => setActionType('sell')}
              style={{
                flex: 1,
                padding: 'clamp(0.3rem, 1vw, 0.5rem) clamp(0.6rem, 1.5vw, 0.9rem)',
                backgroundColor: actionType === 'sell' ? colors.mainAccentColor : 'transparent',
                border: 'none',
                borderRadius: 0,
                color: actionType === 'sell' ? colors.buttonTextColor : colors.secondaryTextColor,
                fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Sell
            </button>
          </div>
        </div>

        {/* SOL Deposit Input Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '0.8rem',
          marginBottom: 'clamp(0.6rem, 1.5vh, 0.8rem)',
          paddingBottom: '0.8rem',
          borderBottom: `0.5px solid ${colors.mainBorderColor}`,
          flexShrink: 0,
          flexWrap: 'wrap'
        }}>
          {/* SOL Deposit Input Box */}
          <div 
            style={{
              flex: '1 1 200px',
              minWidth: '150px',
              backgroundColor: isInputFocused ? colors.inputBackground : colors.mainSectionColor,
              border: `0.5px solid ${colors.mainBorderColor}`,
              borderRadius: 0,
              padding: 'clamp(0.2rem, 0.6vw, 0.35rem) clamp(0.4rem, 1.5vw, 0.7rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'background-color 0.2s ease',
              cursor: 'text'
            }}
            onMouseEnter={() => setIsInputFocused(true)}
            onMouseLeave={() => setIsInputFocused(false)}
          >
            <p style={{
              fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
              color: colors.secondaryTextColor,
              margin: '0 0 0.25rem 0',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Amount
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 'auto'
            }}>
              <input
                type="text"
                value={depositAmount}
                onChange={handleInputChange}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: colors.mainTextColor,
                  fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
                  fontWeight: '600',
                  outline: 'none',
                  flex: 1,
                  padding: '0'
                }}
                placeholder="0.0"
              />
              
              <svg viewBox="0 0 101 88" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 'clamp(1.125rem, 2.5vw, 1.375rem)', height: 'clamp(1rem, 2.25vw, 1.25rem)', marginLeft: 'clamp(0.3rem, 1vw, 0.5rem)' }}>
                <path d="M100.48 69.3817L83.8068 86.8015C83.4444 87.1799 83.0058 87.4816 82.5185 87.6878C82.0312 87.894 81.5055 88.0003 80.9743 88H1.93563C1.55849 88 1.18957 87.8926 0.874202 87.6912C0.558829 87.4897 0.31074 87.2029 0.160416 86.8659C0.0100923 86.529 -0.0359181 86.1566 0.0280382 85.7945C0.0919944 85.4324 0.263131 85.0964 0.520422 84.8278L17.2061 67.408C17.5676 67.0306 18.0047 66.7295 18.4904 66.5234C18.9762 66.3172 19.5002 66.2104 20.0301 66.2095H99.0644C99.4415 66.2095 99.8104 66.3169 100.126 66.5183C100.441 66.7198 100.689 67.0067 100.84 67.3436C100.99 67.6806 101.036 68.0529 100.972 68.415C100.908 68.7771 100.737 69.1131 100.48 69.3817ZM83.8068 34.3032C83.4444 33.9248 83.0058 33.6231 82.5185 33.4169C82.0312 33.2108 81.5055 33.1045 80.9743 33.1048H1.93563C1.55849 33.1048 1.18957 33.2121 0.874202 33.4136C0.558829 33.6151 0.31074 33.9019 0.160416 34.2388C0.0100923 34.5758 -0.0359181 34.9482 0.0280382 35.3103C0.0919944 35.6723 0.263131 36.0083 0.520422 36.277L17.2061 53.6968C17.5676 54.0742 18.0047 54.3752 18.4904 54.5814C18.9762 54.7875 19.5002 54.8944 20.0301 54.8952H99.0644C99.4415 54.8952 99.8104 54.7879 100.126 54.5864C100.441 54.3849 100.689 54.0981 100.84 53.7612C100.99 53.4242 101.036 53.0518 100.972 52.6897C100.908 52.3277 100.737 51.9917 100.48 51.723L83.8068 34.3032ZM1.93563 21.7905H80.9743C81.5055 21.7907 82.0312 21.6845 82.5185 21.4783C83.0058 21.2721 83.4444 20.9704 83.8068 20.592L100.48 3.17219C100.737 2.90357 100.908 2.56758 100.972 2.2055C101.036 1.84342 100.99 1.47103 100.84 1.13408C100.689 0.79713 100.441 0.510296 100.126 0.308823C99.8104 0.107349 99.4415 1.24074e-05 99.0644 0L20.0301 0C19.5002 0.000878397 18.9762 0.107699 18.4904 0.313848C18.0047 0.519998 17.5676 0.821087 17.2061 1.19848L0.524723 18.6183C0.267681 18.8866 0.0966198 19.2223 0.0325185 19.5839C-0.0315829 19.9456 0.0140624 20.3177 0.163856 20.6545C0.31365 20.9913 0.561081 21.2781 0.875804 21.4799C1.19053 21.6817 1.55886 21.7896 1.93563 21.7905Z" fill="url(#paint0_linear_174_4403)"/>
                <defs>
                  <linearGradient id="paint0_linear_174_4403" x1="8.52558" y1="90.0973" x2="88.9933" y2="-3.01622" gradientUnits="userSpaceOnUse">
                    <stop offset="0.08" stop-color="#9945FF"/>
                    <stop offset="0.3" stop-color="#8752F3"/>
                    <stop offset="0.5" stop-color="#5497D5"/>
                    <stop offset="0.6" stop-color="#43B4CA"/>
                    <stop offset="0.72" stop-color="#28E0B9"/>
                    <stop offset="0.97" stop-color="#19FB9B"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          
          {/* Your Funds Display */}
          <div style={{
            flex: '1 1 200px',
            minWidth: '150px',
            backgroundColor: colors.positionBoxBackground,
            border: `0.5px solid ${colors.mainBorderColor}`,
                    borderRadius: 0,
            padding: 'clamp(0.2rem, 0.6vw, 0.35rem) clamp(0.4rem, 1.5vw, 0.7rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <p style={{
              fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
              color: colors.secondaryTextColor,
              margin: '0 0 0.25rem 0',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Current Position Size
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 'auto'
            }}>
              <span style={{
                fontSize: 'clamp(0.95rem, 2.2vw, 1.15rem)',
                color: colors.mainTextColor,
                fontWeight: '600'
              }}>
                0
              </span>
              
              <svg viewBox="0 0 101 88" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 'clamp(1.125rem, 2.5vw, 1.375rem)', height: 'clamp(1rem, 2.25vw, 1.25rem)', marginLeft: 'clamp(0.3rem, 1vw, 0.5rem)' }}>
                <path d="M100.48 69.3817L83.8068 86.8015C83.4444 87.1799 83.0058 87.4816 82.5185 87.6878C82.0312 87.894 81.5055 88.0003 80.9743 88H1.93563C1.55849 88 1.18957 87.8926 0.874202 87.6912C0.558829 87.4897 0.31074 87.2029 0.160416 86.8659C0.0100923 86.529 -0.0359181 86.1566 0.0280382 85.7945C0.0919944 85.4324 0.263131 85.0964 0.520422 84.8278L17.2061 67.408C17.5676 67.0306 18.0047 66.7295 18.4904 66.5234C18.9762 66.3172 19.5002 66.2104 20.0301 66.2095H99.0644C99.4415 66.2095 99.8104 66.3169 100.126 66.5183C100.441 66.7198 100.689 67.0067 100.84 67.3436C100.99 67.6806 101.036 68.0529 100.972 68.415C100.908 68.7771 100.737 69.1131 100.48 69.3817ZM83.8068 34.3032C83.4444 33.9248 83.0058 33.6231 82.5185 33.4169C82.0312 33.2108 81.5055 33.1045 80.9743 33.1048H1.93563C1.55849 33.1048 1.18957 33.2121 0.874202 33.4136C0.558829 33.6151 0.31074 33.9019 0.160416 34.2388C0.0100923 34.5758 -0.0359181 34.9482 0.0280382 35.3103C0.0919944 35.6723 0.263131 36.0083 0.520422 36.277L17.2061 53.6968C17.5676 54.0742 18.0047 54.3752 18.4904 54.5814C18.9762 54.7875 19.5002 54.8944 20.0301 54.8952H99.0644C99.4415 54.8952 99.8104 54.7879 100.126 54.5864C100.441 54.3849 100.689 54.0981 100.84 53.7612C100.99 53.4242 101.036 53.0518 100.972 52.6897C100.908 52.3277 100.737 51.9917 100.48 51.723L83.8068 34.3032ZM1.93563 21.7905H80.9743C81.5055 21.7907 82.0312 21.6845 82.5185 21.4783C83.0058 21.2721 83.4444 20.9704 83.8068 20.592L100.48 3.17219C100.737 2.90357 100.908 2.56758 100.972 2.2055C101.036 1.84342 100.99 1.47103 100.84 1.13408C100.689 0.79713 100.441 0.510296 100.126 0.308823C99.8104 0.107349 99.4415 1.24074e-05 99.0644 0L20.0301 0C19.5002 0.000878397 18.9762 0.107699 18.4904 0.313848C18.0047 0.519998 17.5676 0.821087 17.2061 1.19848L0.524723 18.6183C0.267681 18.8866 0.0966198 19.2223 0.0325185 19.5839C-0.0315829 19.9456 0.0140624 20.3177 0.163856 20.6545C0.31365 20.9913 0.561081 21.2781 0.875804 21.4799C1.19053 21.6817 1.55886 21.7896 1.93563 21.7905Z" fill="url(#paint0_linear_174_4403)"/>
                <defs>
                  <linearGradient id="paint0_linear_174_4403" x1="8.52558" y1="90.0973" x2="88.9933" y2="-3.01622" gradientUnits="userSpaceOnUse">
                    <stop offset="0.08" stop-color="#9945FF"/>
                    <stop offset="0.3" stop-color="#8752F3"/>
                    <stop offset="0.5" stop-color="#5497D5"/>
                    <stop offset="0.6" stop-color="#43B4CA"/>
                    <stop offset="0.72" stop-color="#28E0B9"/>
                    <stop offset="0.97" stop-color="#19FB9B"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>


        {/* Performance Metrics Section */}
        {showStats && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 'clamp(0.4rem, 1.5vw, 0.7rem)',
          marginBottom: 'clamp(0.6rem, 1.5vh, 0.8rem)',
          flexShrink: 1,
          minHeight: 0,
          flexWrap: 'wrap'
        }}>
          {/* Premium Earned Box */}
          <div 
            style={{
              flex: '1 1 120px',
              minWidth: '100px',
              backgroundColor: colors.performanceBoxBackground,
              borderRadius: 0,
              padding: 'clamp(0.2rem, 0.6vw, 0.3rem) clamp(0.4rem, 1.2vw, 0.7rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'background-color 0.2s ease'
            }}
          >
            <p style={{
              fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
              color: colors.secondaryTextColor,
              margin: '0 0 0.15rem 0',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Premiums Earned
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.1rem'
            }}>
              <span style={{
                color: colors.mainTextColor,
                fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
                fontWeight: '600'
              }}>
                2.4 SOL
              </span>
              
              <span style={{
                color: colors.successColor,
                fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
                fontWeight: '500'
              }}>
                +12.3%
              </span>
            </div>
          </div>
          
          {/* Win Rate Display */}
          <div style={{
            flex: '1 1 120px',
            minWidth: '100px',
            backgroundColor: colors.performanceBoxBackground,
                    borderRadius: 0,
            padding: 'clamp(0.2rem, 0.6vw, 0.3rem) clamp(0.4rem, 1.2vw, 0.7rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'background-color 0.2s ease'
          }}>
            <p style={{
              fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
              color: colors.secondaryTextColor,
              margin: '0 0 0.25rem 0',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Win Rate
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 'auto'
            }}>
              <span style={{
                fontSize: 'clamp(0.95rem, 2.2vw, 1.15rem)',
                color: colors.mainTextColor,
                fontWeight: '600'
              }}>
                78.5%
              </span>
              
              <span style={{
                color: colors.successColor,
                fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
                fontWeight: '500'
              }}>
                vs Call Buyers
              </span>
            </div>
          </div>
        </div>
        )}

        {/* Strategy Performance Section */}
        {showStrategyPerformance && (
        <div style={{
          backgroundColor: colors.performanceBoxBackground,
          borderRadius: 0,
          padding: 'clamp(0.4rem, 1.2vw, 0.6rem) clamp(0.5rem, 1.5vw, 0.8rem)',
          marginBottom: 'clamp(0.6rem, 1.5vh, 0.8rem)',
          flexShrink: 1,
          minHeight: 0
        }}>
          {/* Strategy Performance Label */}
          <p style={{
            fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
            color: colors.infoTextColor,
            margin: '0 0 0.4rem 0',
            fontWeight: '500'
          }}>
            Strategy Performance
          </p>
          
          {/* Performance Display with Icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {/* Success Icon */}
            <svg style={{ width: 'clamp(0.875rem, 2vw, 1.125rem)', height: 'clamp(0.875rem, 2vw, 1.125rem)', color: colors.successColor }} viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M18 6H10M18 6V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            
            {/* Performance Amount */}
            <span style={{
              fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
              color: colors.successColor,
              fontWeight: '600'
            }}>
              +{lifetimeEarned.toFixed(2)} SOL ({(lifetimeEarned * 100).toFixed(1)}%)
            </span>
          </div>
          
          <p style={{
            fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
            color: colors.secondaryTextColor,
            margin: '0.5rem 0 0 0',
            fontStyle: 'italic'
          }}>
            Profiting from call buyers being wrong about Solana memecoin price direction
          </p>
        </div>
        )}

            {/* How it Works Section */}
            {showHowItWorks && (
            <div style={{
              marginBottom: 'clamp(0.6rem, 1.5vh, 0.8rem)',
              flexShrink: 1,
              minHeight: 0
            }}>
              <p style={{
                fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
                color: colors.mainTextColor,
                margin: '0 0 0.6rem 0',
                fontWeight: '600'
              }}>
                How it Works
              </p>
              
              <p style={{
                fontSize: 'clamp(0.65rem, 1.6vw, 0.8rem)',
                color: colors.secondaryTextColor,
                margin: '0',
                lineHeight: '1.4',
                fontStyle: 'italic'
              }}>
                You profit when <span style={{ color: colors.mainAccentColor, fontWeight: '600' }}>call option buyers are wrong</span> about memecoin price direction and <span style={{ color: colors.mainAccentColor, fontWeight: '600' }}>volatility</span>. You collect premiums from traders betting prices will rise, while betting they won't rise enough within the contract timeframe. On our platform, you don't choose specific contracts - instead, you make a <span style={{ color: colors.mainAccentColor, fontWeight: '600' }}>site-wide bet against all call traders</span>, with all funds pooled together to cover all open contracts.
              </p>
            </div>
            )}

            {/* Action Button */}
            <div style={{
              marginTop: 'auto',
              flexShrink: 0
            }}>
              <button style={{
                width: '100%',
                backgroundColor: actionType === 'buy' ? colors.successBright : colors.mainAccentColor,
                border: 'none',
                borderRadius: 0,
                padding: 'clamp(0.75rem, 2vh, 1.1rem)',
                color: actionType === 'buy' ? '#000000' : colors.buttonTextColor,
                fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
                fontWeight: '650',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = actionType === 'buy' ? '#12D17E' : colors.accentHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = actionType === 'buy' ? colors.successBright : colors.mainAccentColor;
              }}>
                {actionType === 'buy' ? `Buy ${depositAmount || '0'} Covered Calls` : `Sell ${depositAmount || '0'} Covered Calls`}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Combined Header Row with Strategy Overview and Buy/Sell Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(0.5rem, 2vw, 1rem)',
              marginBottom: 'clamp(0.75rem, 1.5vh, 1rem)',
              flexShrink: 0,
              flexWrap: 'wrap'
            }}>
              {/* Header Group (Icon + Title) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(0.5rem, 2vw, 1rem)',
                flex: '1 1 auto',
                minWidth: 0
              }}>
                {/* Strategy Icon */}
                <img 
                  src="/icons/logo.svg" 
                  alt="Logo" 
                  style={{
                    width: 'clamp(2.5rem, 6vw, 3.75rem)',
                    height: 'clamp(2.5rem, 6vw, 3.75rem)',
                    flexShrink: 0,
                    objectFit: 'contain'
                  }}
                />
                
                {/* Strategy Info */}
                <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                  <h2 style={{
                    fontSize: 'clamp(1.25rem, 4vw, 2rem)',
                    fontWeight: '500',
                    color: colors.mainTextColor,
                    margin: '0 0 clamp(0.15rem, 0.5vh, 0.25rem) 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Covered Puts
                  </h2>
                  <p style={{
                    fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                    color: colors.mainAccentColor,
                    fontWeight: '500',
                    margin: 0
                  }}>
                    Bet Against Put Buyers
                  </p>
                </div>
              </div>

              {/* Buy/Sell Toggle */}
              <div style={{
                display: viewportWidth < 400 ? 'none' : 'flex',
                backgroundColor: colors.mainSectionColor,
                borderRadius: 0,
                padding: 'clamp(2px, 0.3vw, 3px)',
                border: `1px solid ${colors.mainBorderColor}`,
                flexShrink: 0,
                minWidth: 'clamp(120px, 25vw, 180px)'
              }}>
                <button
                  onClick={() => setActionType('buy')}
                  style={{
                    flex: 1,
                    padding: 'clamp(0.3rem, 1vw, 0.5rem) clamp(0.6rem, 1.5vw, 0.9rem)',
                    backgroundColor: actionType === 'buy' ? colors.successBright : 'transparent',
                    border: 'none',
                    borderRadius: 0,
                    color: actionType === 'buy' ? '#000000' : colors.secondaryTextColor,
                    fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Buy
                </button>
                <button
                  onClick={() => setActionType('sell')}
                  style={{
                    flex: 1,
                    padding: 'clamp(0.3rem, 1vw, 0.5rem) clamp(0.6rem, 1.5vw, 0.9rem)',
                    backgroundColor: actionType === 'sell' ? colors.mainAccentColor : 'transparent',
                    border: 'none',
                    borderRadius: 0,
                    color: actionType === 'sell' ? colors.buttonTextColor : colors.secondaryTextColor,
                    fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Sell
                </button>
              </div>
            </div>

            {/* SOL Deposit Input Section */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '0.8rem',
              marginBottom: 'clamp(0.6rem, 1.5vh, 0.8rem)',
              paddingBottom: '0.8rem',
              borderBottom: `0.5px solid ${colors.mainBorderColor}`,
              flexShrink: 0
            }}>
              {/* SOL Deposit Input Box */}
              <div 
                style={{
                  flex: 1,
                  backgroundColor: isInputFocused ? colors.inputBackground : colors.mainSectionColor,
                  border: `0.5px solid ${colors.mainBorderColor}`,
                  borderRadius: 0,
                  padding: 'clamp(0.2rem, 0.6vw, 0.35rem) clamp(0.4rem, 1.5vw, 0.7rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'background-color 0.2s ease',
                  cursor: 'text'
                }}
                onMouseEnter={() => setIsInputFocused(true)}
                onMouseLeave={() => setIsInputFocused(false)}
              >
                <p style={{
                  fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                  color: colors.secondaryTextColor,
                  margin: '0 0 0.25rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Amount
                </p>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 'auto'
                }}>
                  <input
                    type="text"
                    value={depositAmount}
                    onChange={handleInputChange}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: colors.mainTextColor,
                      fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
                      fontWeight: '600',
                      outline: 'none',
                      flex: 1,
                      padding: '0'
                    }}
                    placeholder="0.0"
                  />
                  
                  <svg viewBox="0 0 101 88" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 'clamp(1.125rem, 2.5vw, 1.375rem)', height: 'clamp(1rem, 2.25vw, 1.25rem)', marginLeft: 'clamp(0.3rem, 1vw, 0.5rem)' }}>
                    <path d="M100.48 69.3817L83.8068 86.8015C83.4444 87.1799 83.0058 87.4816 82.5185 87.6878C82.0312 87.894 81.5055 88.0003 80.9743 88H1.93563C1.55849 88 1.18957 87.8926 0.874202 87.6912C0.558829 87.4897 0.31074 87.2029 0.160416 86.8659C0.0100923 86.529 -0.0359181 86.1566 0.0280382 85.7945C0.0919944 85.4324 0.263131 85.0964 0.520422 84.8278L17.2061 67.408C17.5676 67.0306 18.0047 66.7295 18.4904 66.5234C18.9762 66.3172 19.5002 66.2104 20.0301 66.2095H99.0644C99.4415 66.2095 99.8104 66.3169 100.126 66.5183C100.441 66.7198 100.689 67.0067 100.84 67.3436C100.99 67.6806 101.036 68.0529 100.972 68.415C100.908 68.7771 100.737 69.1131 100.48 69.3817ZM83.8068 34.3032C83.4444 33.9248 83.0058 33.6231 82.5185 33.4169C82.0312 33.2108 81.5055 33.1045 80.9743 33.1048H1.93563C1.55849 33.1048 1.18957 33.2121 0.874202 33.4136C0.558829 33.6151 0.31074 33.9019 0.160416 34.2388C0.0100923 34.5758 -0.0359181 34.9482 0.0280382 35.3103C0.0919944 35.6723 0.263131 36.0083 0.520422 36.277L17.2061 53.6968C17.5676 54.0742 18.0047 54.3752 18.4904 54.5814C18.9762 54.7875 19.5002 54.8944 20.0301 54.8952H99.0644C99.4415 54.8952 99.8104 54.7879 100.126 54.5864C100.441 54.3849 100.689 54.0981 100.84 53.7612C100.99 53.4242 101.036 53.0518 100.972 52.6897C100.908 52.3277 100.737 51.9917 100.48 51.723L83.8068 34.3032ZM1.93563 21.7905H80.9743C81.5055 21.7907 82.0312 21.6845 82.5185 21.4783C83.0058 21.2721 83.4444 20.9704 83.8068 20.592L100.48 3.17219C100.737 2.90357 100.908 2.56758 100.972 2.2055C101.036 1.84342 100.99 1.47103 100.84 1.13408C100.689 0.79713 100.441 0.510296 100.126 0.308823C99.8104 0.107349 99.4415 1.24074e-05 99.0644 0L20.0301 0C19.5002 0.000878397 18.9762 0.107699 18.4904 0.313848C18.0047 0.519998 17.5676 0.821087 17.2061 1.19848L0.524723 18.6183C0.267681 18.8866 0.0966198 19.2223 0.0325185 19.5839C-0.0315829 19.9456 0.0140624 20.3177 0.163856 20.6545C0.31365 20.9913 0.561081 21.2781 0.875804 21.4799C1.19053 21.6817 1.55886 21.7896 1.93563 21.7905Z" fill="url(#paint0_linear_174_4403)"/>
                    <defs>
                      <linearGradient id="paint0_linear_174_4403" x1="8.52558" y1="90.0973" x2="88.9933" y2="-3.01622" gradientUnits="userSpaceOnUse">
                        <stop offset="0.08" stop-color="#9945FF"/>
                        <stop offset="0.3" stop-color="#8752F3"/>
                        <stop offset="0.5" stop-color="#5497D5"/>
                        <stop offset="0.6" stop-color="#43B4CA"/>
                        <stop offset="0.72" stop-color="#28E0B9"/>
                        <stop offset="0.97" stop-color="#19FB9B"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              
              {/* Your Funds Display */}
              <div style={{
                flex: 1,
                backgroundColor: colors.positionBoxBackground,
                border: `0.5px solid ${colors.mainBorderColor}`,
                borderRadius: 0,
                padding: 'clamp(0.2rem, 0.6vw, 0.35rem) clamp(0.4rem, 1.5vw, 0.7rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <p style={{
                  fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                  color: colors.secondaryTextColor,
                  margin: '0 0 0.25rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Current Position Size
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 'auto'
                }}>
                  <span style={{
                    fontSize: 'clamp(0.95rem, 2.2vw, 1.15rem)',
                    color: colors.mainTextColor,
                    fontWeight: '600'
                  }}>
                    0
                  </span>
                  
                  <svg viewBox="0 0 101 88" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 'clamp(1.125rem, 2.5vw, 1.375rem)', height: 'clamp(1rem, 2.25vw, 1.25rem)', marginLeft: 'clamp(0.3rem, 1vw, 0.5rem)' }}>
                    <path d="M100.48 69.3817L83.8068 86.8015C83.4444 87.1799 83.0058 87.4816 82.5185 87.6878C82.0312 87.894 81.5055 88.0003 80.9743 88H1.93563C1.55849 88 1.18957 87.8926 0.874202 87.6912C0.558829 87.4897 0.31074 87.2029 0.160416 86.8659C0.0100923 86.529 -0.0359181 86.1566 0.0280382 85.7945C0.0919944 85.4324 0.263131 85.0964 0.520422 84.8278L17.2061 67.408C17.5676 67.0306 18.0047 66.7295 18.4904 66.5234C18.9762 66.3172 19.5002 66.2104 20.0301 66.2095H99.0644C99.4415 66.2095 99.8104 66.3169 100.126 66.5183C100.441 66.7198 100.689 67.0067 100.84 67.3436C100.99 67.6806 101.036 68.0529 100.972 68.415C100.908 68.7771 100.737 69.1131 100.48 69.3817ZM83.8068 34.3032C83.4444 33.9248 83.0058 33.6231 82.5185 33.4169C82.0312 33.2108 81.5055 33.1045 80.9743 33.1048H1.93563C1.55849 33.1048 1.18957 33.2121 0.874202 33.4136C0.558829 33.6151 0.31074 33.9019 0.160416 34.2388C0.0100923 34.5758 -0.0359181 34.9482 0.0280382 35.3103C0.0919944 35.6723 0.263131 36.0083 0.520422 36.277L17.2061 53.6968C17.5676 54.0742 18.0047 54.3752 18.4904 54.5814C18.9762 54.7875 19.5002 54.8944 20.0301 54.8952H99.0644C99.4415 54.8952 99.8104 54.7879 100.126 54.5864C100.441 54.3849 100.689 54.0981 100.84 53.7612C100.99 53.4242 101.036 53.0518 100.972 52.6897C100.908 52.3277 100.737 51.9917 100.48 51.723L83.8068 34.3032ZM1.93563 21.7905H80.9743C81.5055 21.7907 82.0312 21.6845 82.5185 21.4783C83.0058 21.2721 83.4444 20.9704 83.8068 20.592L100.48 3.17219C100.737 2.90357 100.908 2.56758 100.972 2.2055C101.036 1.84342 100.99 1.47103 100.84 1.13408C100.689 0.79713 100.441 0.510296 100.126 0.308823C99.8104 0.107349 99.4415 1.24074e-05 99.0644 0L20.0301 0C19.5002 0.000878397 18.9762 0.107699 18.4904 0.313848C18.0047 0.519998 17.5676 0.821087 17.2061 1.19848L0.524723 18.6183C0.267681 18.8866 0.0966198 19.2223 0.0325185 19.5839C-0.0315829 19.9456 0.0140624 20.3177 0.163856 20.6545C0.31365 20.9913 0.561081 21.2781 0.875804 21.4799C1.19053 21.6817 1.55886 21.7896 1.93563 21.7905Z" fill="url(#paint0_linear_174_4403)"/>
                    <defs>
                      <linearGradient id="paint0_linear_174_4403" x1="8.52558" y1="90.0973" x2="88.9933" y2="-3.01622" gradientUnits="userSpaceOnUse">
                        <stop offset="0.08" stop-color="#9945FF"/>
                        <stop offset="0.3" stop-color="#8752F3"/>
                        <stop offset="0.5" stop-color="#5497D5"/>
                        <stop offset="0.6" stop-color="#43B4CA"/>
                        <stop offset="0.72" stop-color="#28E0B9"/>
                        <stop offset="0.97" stop-color="#19FB9B"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>


            {/* Performance Metrics Section */}
            {showStats && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 'clamp(0.4rem, 1.5vw, 0.7rem)',
              marginBottom: 'clamp(0.6rem, 1.5vh, 0.8rem)',
              flexShrink: 1,
              minHeight: 0,
              flexWrap: 'wrap'
            }}>
              {/* Premium Earned Box */}
              <div 
                style={{
                  flex: 1,
                  backgroundColor: colors.performanceBoxBackground,
                  borderRadius: 0,
                  padding: 'clamp(0.2rem, 0.6vw, 0.35rem) clamp(0.4rem, 1.5vw, 0.7rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <p style={{
                  fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                  color: colors.secondaryTextColor,
                  margin: '0 0 0.15rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Premiums Earned
                </p>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '0.1rem'
                }}>
                  <span style={{
                    color: colors.mainTextColor,
                    fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
                    fontWeight: '600'
                  }}>
                    2.4 SOL
                  </span>
                  
                  <span style={{
                    color: colors.successColor,
                    fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
                    fontWeight: '500'
                  }}>
                    +12.3%
                  </span>
                </div>
              </div>
              
              {/* Win Rate Display */}
              <div style={{
                flex: 1,
                backgroundColor: colors.performanceBoxBackground,
                borderRadius: 0,
                padding: 'clamp(0.2rem, 0.6vw, 0.35rem) clamp(0.4rem, 1.5vw, 0.7rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'background-color 0.2s ease'
              }}>
                <p style={{
                  fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                  color: colors.secondaryTextColor,
                  margin: '0 0 0.25rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Win Rate
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 'auto'
                }}>
                  <span style={{
                    fontSize: 'clamp(0.95rem, 2.2vw, 1.15rem)',
                    color: colors.mainTextColor,
                    fontWeight: '600'
                  }}>
                    78.5%
                  </span>
                  
                  <span style={{
                    color: colors.successColor,
                    fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
                    fontWeight: '500'
                  }}>
                    vs Put Buyers
                  </span>
                </div>
              </div>
            </div>
            )}

            {/* Strategy Performance Section */}
            {showStrategyPerformance && (
            <div style={{
              backgroundColor: colors.performanceBoxBackground,
              borderRadius: 0,
              padding: 'clamp(0.4rem, 1.2vw, 0.6rem) clamp(0.5rem, 1.5vw, 0.8rem)',
              marginBottom: 'clamp(0.6rem, 1.5vh, 0.8rem)',
              flexShrink: 1,
              minHeight: 0
            }}>
              {/* Strategy Performance Label */}
              <p style={{
                fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
                color: colors.infoTextColor,
                margin: '0 0 0.4rem 0',
                fontWeight: '500'
              }}>
                Strategy Performance
              </p>
              
              {/* Performance Display with Icon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {/* Success Icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: colors.successColor }}>
                  <path d="M6 18L18 6M18 6H10M18 6V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                
                {/* Performance Amount */}
                <span style={{
                  fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
                  color: colors.successColor,
                  fontWeight: '600'
                }}>
                  +{lifetimeEarned.toFixed(2)} SOL ({(lifetimeEarned * 100).toFixed(1)}%)
                </span>
              </div>
              
              <p style={{
                fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
                color: colors.secondaryTextColor,
                margin: '0.5rem 0 0 0',
                fontStyle: 'italic'
              }}>
                Profiting from put buyers being wrong about Solana memecoin price direction
              </p>
            </div>
            )}

            {/* How it Works Section */}
            {showHowItWorks && (
            <div style={{
              marginBottom: 'clamp(0.6rem, 1.5vh, 0.8rem)',
              flexShrink: 1,
              minHeight: 0
            }}>
              <p style={{
                fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
                color: colors.mainTextColor,
                margin: '0 0 0.6rem 0',
                fontWeight: '600'
              }}>
                How it Works
              </p>
              
              <p style={{
                fontSize: 'clamp(0.65rem, 1.6vw, 0.8rem)',
                color: colors.secondaryTextColor,
                margin: '0',
                lineHeight: '1.4',
                fontStyle: 'italic'
              }}>
                You profit when <span style={{ color: colors.mainAccentColor, fontWeight: '600' }}>put option buyers are wrong</span> about memecoin price direction and <span style={{ color: colors.mainAccentColor, fontWeight: '600' }}>volatility</span>. You collect premiums from traders betting prices will fall, while betting they won't fall enough within the contract timeframe. On our platform, you don't choose specific contracts - instead, you make a <span style={{ color: colors.mainAccentColor, fontWeight: '600' }}>site-wide bet against all put traders</span>, with all funds pooled together to cover all open contracts.
              </p>
            </div>
            )}

            {/* Action Button */}
            <div style={{
              marginTop: 'auto',
              flexShrink: 0
            }}>
              <button style={{
                width: '100%',
                backgroundColor: actionType === 'buy' ? colors.successBright : colors.mainAccentColor,
                border: 'none',
                borderRadius: 0,
                padding: 'clamp(0.75rem, 2vh, 1.1rem)',
                color: actionType === 'buy' ? '#000000' : colors.buttonTextColor,
                fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
                fontWeight: '650',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = actionType === 'buy' ? '#12D17E' : colors.accentHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = actionType === 'buy' ? colors.successBright : colors.mainAccentColor;
              }}>
                {actionType === 'buy' ? `Buy ${depositAmount || '0'} Covered Puts` : `Sell ${depositAmount || '0'} Covered Puts`}
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
};
