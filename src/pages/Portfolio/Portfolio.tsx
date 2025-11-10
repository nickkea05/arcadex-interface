import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { colors } from '../../theme';
import { PnLChart, PnLDataPoint } from './PnLChart';

// Simple Error Boundary Component
class ChartErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Chart Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export const Portfolio: React.FC = () => {
  const timeframe = 'All'; // Always use All timeframe

  // Sample data
  const accountBalance = 0.00;
  const pnl24h = 0.00;
  const pnlPercent = 0.00;
  const volume24h = 0.00;

  // Mock PnL data - All timeframe only
  const mockPnLData: PnLDataPoint[] = Array.from({ length: 90 }, (_, i) => ({
    time: new Date(2024, 7, 1 + i, 0, 0, 0).toISOString(),
    value: 1000 - (i * 15) + Math.cos(i * 0.2) * 75
  }));

  return (
    <div style={{
      height: '100%',
      backgroundColor: colors.mainBackgroundColor,
      color: colors.mainTextColor,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Main Content Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 'clamp(1rem, 2vw, 1.5rem)',
        gap: 'clamp(1rem, 2vh, 1.5rem)',
        overflow: 'auto',
        minHeight: 0
      }}>
        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: '600',
          margin: 0,
          flexShrink: 0
        }}>
          Portfolio
        </h1>

        {/* Top Section: Account Stats and Chart */}
        <div style={{
          display: 'flex',
          gap: 'clamp(1rem, 2vw, 1.5rem)',
          flexShrink: 0,
          flexWrap: 'wrap'
        }}>
          {/* Left: Account Balance and Stats */}
          <div style={{
            flex: '1 1 300px',
            minWidth: '280px',
            border: `1px solid ${colors.mainBorderColor}`,
            borderRadius: 0,
            padding: 'clamp(1rem, 2vw, 1.5rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(1rem, 2vh, 1.5rem)',
            background: `linear-gradient(to top, ${colors.mainAccentColor}35, ${colors.mainBackgroundColor} 60%)`
          }}>
            {/* Account Balance */}
            <div>
              <p style={{
                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                color: colors.mainTextColor,
                margin: '0 0 0.5rem 0',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: '600'
              }}>
                Account Balance
              </p>
              <p style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: '700',
                margin: 0,
                color: colors.mainTextColor
              }}>
                ${accountBalance.toFixed(2)}
              </p>
            </div>

            {/* Stats Grid */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(0.75rem, 1.5vh, 1rem)',
              paddingTop: 'clamp(0.75rem, 1.5vh, 1rem)',
              borderTop: `1px solid ${colors.mainBorderColor}`
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                  color: colors.secondaryTextColor
                }}>
                  PnL (24H)
                </span>
                <span style={{
                  fontSize: 'clamp(0.875rem, 1.75vw, 1rem)',
                  fontWeight: '600',
                  color: pnl24h >= 0 ? colors.successColor : colors.errorColor
                }}>
                  ${pnl24h.toFixed(2)} ({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                  color: colors.secondaryTextColor
                }}>
                  Volume (24H)
                </span>
                <span style={{
                  fontSize: 'clamp(0.875rem, 1.75vw, 1rem)',
                  fontWeight: '600'
                }}>
                  ${volume24h.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Products Section */}
            <div style={{
              paddingTop: 'clamp(0.75rem, 1.5vh, 1rem)',
              borderTop: `1px solid ${colors.mainBorderColor}`
            }}>
              <p style={{
                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                color: colors.secondaryTextColor,
                margin: '0 0 0.75rem 0',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Products
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.5rem, 1vh, 0.75rem)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                    color: colors.tertiaryTextColor
                  }}>
                    Cover balance
                  </span>
                  <span style={{
                    fontSize: 'clamp(0.875rem, 1.75vw, 1rem)',
                    fontWeight: '500'
                  }}>
                    $0.00
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                    color: colors.tertiaryTextColor
                  }}>
                    Spot balance
                  </span>
                  <span style={{
                    fontSize: 'clamp(0.875rem, 1.75vw, 1rem)',
                    fontWeight: '500'
                  }}>
                    $0.00
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                    color: colors.tertiaryTextColor
                  }}>
                    Options balance
                  </span>
                  <span style={{
                    fontSize: 'clamp(0.875rem, 1.75vw, 1rem)',
                    fontWeight: '500'
                  }}>
                    $0.00
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Chart */}
          <div style={{
            flex: '2 1 400px',
            minWidth: '300px',
            backgroundColor: colors.mainBackgroundColor,
            border: `1px solid ${colors.mainBorderColor}`,
            borderRadius: 0,
            padding: 'clamp(1rem, 2vw, 1.5rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.75rem, 1.5vh, 1rem)'
          }}>
            {/* Chart Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              {/* Header Title */}
              <h2 style={{
                fontSize: 'clamp(0.875rem, 1.75vw, 1rem)',
                fontWeight: '600',
                margin: 0,
                color: colors.mainTextColor
              }}>
                Realized PNL
              </h2>

            </div>

            {/* Chart Area */}
            <div style={{
              flex: 1,
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(0.5rem, 1vh, 0.75rem)',
              alignItems: 'stretch',
              justifyContent: 'stretch',
              minWidth: 0
            }}>
              <div style={{ 
                flex: 1, 
                minHeight: '200px', 
                minWidth: 0,
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'stretch'
              }}>
                {mockPnLData && mockPnLData.length > 0 ? (
                  <ChartErrorBoundary
                    fallback={
                      <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.errorColor,
                        fontSize: 'clamp(0.875rem, 1.75vw, 1rem)'
                      }}>
                        Chart failed to load
                      </div>
                    }
                  >
                    <PnLChart 
                      data={mockPnLData} 
                      height={300}
                      title="Realized PnL"
                    />
                  </ChartErrorBoundary>
                ) : (
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.tertiaryTextColor,
                    fontSize: 'clamp(0.875rem, 1.75vw, 1rem)'
                  }}>
                    No PnL data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Three Columns */}
        <div style={{
          display: 'flex',
          gap: 'clamp(1rem, 2vw, 1.5rem)',
          flexShrink: 0,
          flexWrap: 'wrap'
        }}>
          {/* Open Contracts */}
          <div style={{
            flex: '1 1 300px',
            minWidth: '250px',
            backgroundColor: colors.mainBackgroundColor,
            border: `1px solid ${colors.mainBorderColor}`,
            borderRadius: 0,
            padding: 'clamp(1rem, 2vw, 1.5rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.75rem, 1.5vh, 1rem)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{
                fontSize: 'clamp(0.875rem, 1.75vw, 1rem)',
                fontWeight: '600',
                margin: 0,
                color: colors.mainTextColor
              }}>
                Open Contracts
              </h3>
              <Link to="/exchange" style={{
                padding: 'clamp(0.25rem, 0.75vw, 0.4rem) clamp(0.5rem, 1.25vw, 0.75rem)',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: 'clamp(3px, 0.5vw, 4px)',
                color: colors.secondaryTextColor,
                fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                Trade now 
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M18 6H10M18 6V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div style={{
              paddingTop: 'clamp(0.75rem, 1.5vh, 1rem)',
              borderTop: `1px solid ${colors.mainBorderColor}`
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'clamp(0.5rem, 1vh, 0.75rem)'
              }}>
                <span style={{
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                  color: colors.secondaryTextColor
                }}>
                  Balance
                </span>
                <span style={{
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  fontWeight: '600'
                }}>
                  $0.00
                </span>
              </div>
              <p style={{
                fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)',
                color: colors.tertiaryTextColor,
                margin: 0,
                textAlign: 'center',
                paddingTop: 'clamp(1rem, 2vh, 1.5rem)'
              }}>
                No open contracts
              </p>
            </div>
          </div>

          {/* Closed Contracts */}
          <div style={{
            flex: '1 1 300px',
            minWidth: '250px',
            backgroundColor: colors.mainBackgroundColor,
            border: `1px solid ${colors.mainBorderColor}`,
            borderRadius: 0,
            padding: 'clamp(1rem, 2vw, 1.5rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.75rem, 1.5vh, 1rem)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{
                fontSize: 'clamp(0.875rem, 1.75vw, 1rem)',
                fontWeight: '600',
                margin: 0,
                color: colors.mainTextColor,
              }}>
                Closed Contracts
              </h3>
              <Link to="/exchange" style={{
                padding: 'clamp(0.25rem, 0.75vw, 0.4rem) clamp(0.5rem, 1.25vw, 0.75rem)',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: 'clamp(3px, 0.5vw, 4px)',
                color: colors.secondaryTextColor,
                fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                Trade now 
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M18 6H10M18 6V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div style={{
              paddingTop: 'clamp(0.75rem, 1.5vh, 1rem)',
              borderTop: `1px solid ${colors.mainBorderColor}`
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'clamp(0.5rem, 1vh, 0.75rem)'
              }}>
                <span style={{
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                  color: colors.secondaryTextColor
                }}>
                  Total PnL
                </span>
                <span style={{
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  fontWeight: '600',
                  color: colors.successColor
                }}>
                  $0.00
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'clamp(0.5rem, 1vh, 0.75rem)'
              }}>
                <span style={{
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                  color: colors.secondaryTextColor
                }}>
                  Contracts
                </span>
                <span style={{
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  fontWeight: '600'
                }}>
                  0
                </span>
              </div>
              <p style={{
                fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)',
                color: colors.tertiaryTextColor,
                margin: 0,
                textAlign: 'center',
                paddingTop: 'clamp(1rem, 2vh, 1.5rem)'
              }}>
                No closed contracts
              </p>
            </div>
          </div>

          {/* Covers */}
          <div style={{
            flex: '1 1 300px',
            minWidth: '250px',
            backgroundColor: colors.mainBackgroundColor,
            border: `1px solid ${colors.mainBorderColor}`,
            borderRadius: 0,
            padding: 'clamp(1rem, 2vw, 1.5rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.75rem, 1.5vh, 1rem)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{
                fontSize: 'clamp(0.875rem, 1.75vw, 1rem)',
                fontWeight: '600',
                margin: 0,
                color: colors.mainTextColor
              }}>
                Covers
              </h3>
              <Link to="/vault" style={{
                padding: 'clamp(0.25rem, 0.75vw, 0.4rem) clamp(0.5rem, 1.25vw, 0.75rem)',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: 'clamp(3px, 0.5vw, 4px)',
                color: colors.secondaryTextColor,
                fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                Cover now 
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M18 6H10M18 6V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div style={{
              paddingTop: 'clamp(0.75rem, 1.5vh, 1rem)',
              borderTop: `1px solid ${colors.mainBorderColor}`
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'clamp(0.5rem, 1vh, 0.75rem)'
              }}>
                <span style={{
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                  color: colors.secondaryTextColor
                }}>
                  Balance
                </span>
                <span style={{
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  fontWeight: '600'
                }}>
                  $0.00
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'clamp(0.5rem, 1vh, 0.75rem)'
              }}>
                <span style={{
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                  color: colors.secondaryTextColor
                }}>
                  PnL
                </span>
                <span style={{
                  fontSize: 'clamp(0.875rem, 1.75vw, 1rem)',
                  fontWeight: '600',
                  color: colors.successColor
                }}>
                  $0.00
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
