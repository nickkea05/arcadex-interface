import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '../../../wallet';
import { colors } from '../../../theme';

export interface NavBarProps {
  className?: string;
}

export const NavBar: React.FC<NavBarProps> = ({ className = '' }) => {
  const location = useLocation();
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Track screen width for responsive fading
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate opacity for nav items based on screen width
  const getNavItemOpacity = (index: number): number => {
    // Start fading at specific screen widths - later than before
    const startFadeWidth = 1200; // Start fading when screen is 1200px wide (larger boundary)
    const completeFadeWidth = 600; // Completely faded by 600px
    
    if (screenWidth >= startFadeWidth) {
      return 1; // Fully visible on large screens
    }
    
    if (screenWidth <= completeFadeWidth) {
      return 0; // Completely faded on small screens
    }
    
    // Calculate which items to fade based on screen size
    // Items fade from right to left (More first, then Docs, etc.)
    const totalItems = navItems.length + 1; // +1 for More button
    const itemsToStartFading = Math.floor((startFadeWidth - screenWidth) / 100); // Start fading every 100px
    
    if (index >= totalItems - itemsToStartFading) {
      // Calculate fade progress for this item
      const itemFadeStart = startFadeWidth - ((totalItems - 1 - index) * 100);
      const itemFadeEnd = itemFadeStart - 150; // 150px fade distance
      
      if (screenWidth <= itemFadeEnd) {
        return 0; // Completely faded
      }
      
      if (screenWidth <= itemFadeStart) {
        // Calculate fade progress
        const fadeProgress = (itemFadeStart - screenWidth) / (itemFadeStart - itemFadeEnd);
        return Math.max(1 - fadeProgress, 0);
      }
    }
    
    return 1;
  };

  const navItems = [
    { label: 'Exchange', path: '/exchange' },
    { label: 'Cover', path: '/vault' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Rewards', path: '/rewards' },
    { label: 'Referral', path: '/referral' },
    { label: 'Docs', path: '/docs' },
  ];

  const moreItems = [
    { label: 'Settings', path: '/settings' },
    { label: 'Support', path: '/support' },
    { label: 'About', path: '/about' },
  ];

  const isActivePath = (path: string) => location.pathname === path;

      const navStyles: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 clamp(1rem, 3vw, 2rem)',
        height: 'clamp(3.5rem, 8vh, 4rem)',
        backgroundColor: colors.mainBackgroundColor,
        flexShrink: 0,
        zIndex: 1000,
      };

  const logoStyles: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: colors.mainTextColor,
    margin: 0,
    letterSpacing: '0.08em',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    textTransform: 'uppercase',
    background: `linear-gradient(90deg, ${colors.mainTextColor} 0%, ${colors.mainAccentColor} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const navItemsContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    transition: 'opacity 0.3s ease',
  };

  const navItemStyles: React.CSSProperties = {
    position: 'relative',
  };

      const navLinkStyles = (isActive: boolean, opacity: number = 1): React.CSSProperties => ({
        color: isActive ? colors.mainAccentColor : colors.mainTextColor,
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: '500',
        padding: '0.5rem 0',
        transition: 'color 0.2s ease, opacity 0.3s ease',
        cursor: 'pointer',
        opacity: opacity,
      });

      const moreButtonStyles = (opacity: number = 1): React.CSSProperties => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        backgroundColor: 'transparent',
        border: 'none',
        color: colors.mainTextColor,
        fontSize: '0.95rem',
        fontWeight: '500',
        padding: '0.5rem 0',
        cursor: 'pointer',
        transition: 'color 0.2s ease, opacity 0.3s ease',
        opacity: opacity,
      });

  const dropdownStyles: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: colors.dropdownBackground,
    border: '1px solid #333333',
    borderRadius: '8px',
    padding: '0.5rem 0',
    minWidth: '120px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    zIndex: 1001,
  };

  const dropdownItemStyles: React.CSSProperties = {
    display: 'block',
    color: colors.mainTextColor,
    textDecoration: 'none',
    fontSize: '0.9rem',
    padding: '0.5rem 1rem',
    transition: 'background-color 0.2s ease',
  };

  const handleMoreClick = () => {
    setShowMoreDropdown(!showMoreDropdown);
  };

  const handleMoreItemClick = () => {
    setShowMoreDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMoreDropdown(false);
      }
    };

    if (showMoreDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreDropdown]);

  return (
    <nav style={navStyles} className={className}>
      {/* Left Side: Logo and Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img 
            src="/icons/logo.svg" 
            alt="Logo" 
            style={{ 
              width: 'clamp(32px, 6vw, 48px)', 
              height: 'clamp(32px, 6vw, 48px)',
              flexShrink: 0
            }} 
          />
          <h1 style={logoStyles}>ARCADEX</h1>
        </Link>

        {/* Desktop Navigation Items */}
        <ul style={navItemsContainerStyles}>
          {navItems.map((item, index) => (
            <li key={item.path} style={navItemStyles}>
              <Link
                to={item.path}
                style={navLinkStyles(isActivePath(item.path), getNavItemOpacity(index))}
                    onMouseEnter={(e) => {
                      if (!isActivePath(item.path)) {
                        e.currentTarget.style.color = colors.mainAccentColor;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActivePath(item.path)) {
                        e.currentTarget.style.color = colors.mainTextColor;
                      }
                    }}
              >
                {item.label}
              </Link>
            </li>
          ))}
          
          {/* More Dropdown */}
          <li style={navItemStyles}>
            <div ref={dropdownRef}>
              <button
                style={moreButtonStyles(getNavItemOpacity(navItems.length))}
                onClick={handleMoreClick}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = colors.mainAccentColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = colors.mainTextColor;
                    }}
              >
                More
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  style={{ 
                    transform: showMoreDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <path 
                    d="M6 9L12 15L18 9" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              
              {showMoreDropdown && (
                <div style={dropdownStyles}>
                  {moreItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      style={dropdownItemStyles}
                      onClick={handleMoreItemClick}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.secondaryBorderColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </li>
        </ul>
      </div>

      {/* Right Side: Wallet Connection - Always visible */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <ConnectButton />
      </div>
    </nav>
  );
};
