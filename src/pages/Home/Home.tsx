import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { colors } from '../../theme';
import Spline from '@splinetool/react-spline';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isSplineLoading, setIsSplineLoading] = useState(true);
  const splineRef = useRef<any>(null);
  const containerStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 'calc(100vh - 4rem)',
    padding: 'clamp(2rem, 5vw, 4rem)',
    paddingTop: 'clamp(1.5rem, 3vw, 2rem)',
    textAlign: 'center',
    backgroundColor: '#000000',
    overflow: 'hidden',
  };

  // Decorative gradient shapes with dull red theme (15% opacity)
  const gradientShape1Styles: React.CSSProperties = {
    position: 'absolute',
    top: '10%',
    right: '5%',
    width: '400px',
    height: '400px',
    background: 'linear-gradient(135deg, rgba(255, 107, 90, 0.15) 0%, rgba(224, 40, 74, 0.15) 100%)',
    borderRadius: '50%',
    filter: 'blur(100px)',
    zIndex: 0,
  };

  const gradientShape2Styles: React.CSSProperties = {
    position: 'absolute',
    bottom: '10%',
    right: '10%',
    width: '300px',
    height: '300px',
    background: 'linear-gradient(135deg, rgba(224, 40, 74, 0.15) 0%, rgba(255, 107, 90, 0.15) 100%)',
    borderRadius: '50%',
    filter: 'blur(100px)',
    zIndex: 0,
  };

  const gradientShape3Styles: React.CSSProperties = {
    position: 'absolute',
    top: '20%',
    left: '5%',
    width: '350px',
    height: '350px',
    background: 'radial-gradient(circle, rgba(224, 40, 74, 0.15) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    zIndex: 0,
  };

  const gradientShape4Styles: React.CSSProperties = {
    position: 'absolute',
    bottom: '5%',
    left: '15%',
    width: '280px',
    height: '280px',
    background: 'radial-gradient(circle, rgba(255, 107, 90, 0.15) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    zIndex: 0,
  };

  const gradientShape5Styles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(224, 40, 74, 0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(120px)',
    zIndex: 0,
  };

  const splineContainerStyles: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-48.75%, -44%) scale(1.05)',
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'auto',
    userSelect: 'none',
  };

  const watermarkHiderStyles = `
    /* Hide Spline watermark */
    .spline-watermark,
    [class*="watermark"],
    a[href*="spline.design"],
    div[style*="position: absolute"][style*="bottom"],
    canvas + div[style*="position: absolute"] {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
    }
    
    /* Disable camera controls - make scene static */
    canvas {
      pointer-events: none !important;
    }
  `;

  const overlayButtonStyles: React.CSSProperties = {
    position: 'fixed',
    top: '80%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    height: '80px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    zIndex: 10,
  };

  const heroSectionStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '800px',
    gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
    position: 'relative',
    zIndex: 10,
  };


  const titleStyles: React.CSSProperties = {
    fontSize: 'clamp(1.75rem, 5.5vw, 3.5rem)',
    fontWeight: '600',
    color: colors.mainTextColor,
    margin: 0,
    lineHeight: 1.1,
    fontFamily: "'Rajdhani', sans-serif",
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap',
  };

  const descriptionStyles: React.CSSProperties = {
    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
    color: colors.secondaryTextColor,
    lineHeight: 1.6,
    maxWidth: '600px',
    margin: 0,
    fontWeight: '400',
    fontFamily: "'Rajdhani', sans-serif",
  };

  const buttonStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(0.875rem, 2vw, 1.125rem) clamp(2.5rem, 6vw, 4rem)',
    backgroundColor: colors.mainAccentColor,
    color: colors.buttonTextColor,
    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
    fontWeight: '600',
    textDecoration: 'none',
    borderRadius: 'clamp(30px, 5vw, 50px)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '1rem',
    fontFamily: "'Rajdhani', sans-serif",
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  };

  const handleSplineMouseDown = (e: any) => {
    console.log('Spline object clicked:', e.target?.name); // Debug log
    
    // Check if a button in the Spline scene was clicked
    if (e.target && e.target.name) {
      const targetName = e.target.name.toLowerCase();
      console.log('Target name:', targetName); // Debug log
      
      // Navigate to exchange page if button is clicked
      if (targetName.includes('button') || targetName.includes('trade') || targetName.includes('start') || targetName.includes('cta')) {
        console.log('Navigating to exchange page');
        navigate('/exchange');
      }
    }
  };

  const handleSplineLoad = (spline: any) => {
    console.log('Spline loaded');
    splineRef.current = spline;
    
    // Disable camera controls to make scene static
    if (spline && spline.setOrbitEnabled) {
      spline.setOrbitEnabled(false);
    }
    if (spline && spline.setZoomEnabled) {
      spline.setZoomEnabled(false);
    }
    if (spline && spline.setPanEnabled) {
      spline.setPanEnabled(false);
    }
    
    setIsSplineLoading(false);
  };

  return (
    <div style={containerStyles}>
      {/* CSS to hide Spline watermark */}
      <style>{watermarkHiderStyles}</style>

      {/* Spline 3D Background */}
      <div style={splineContainerStyles}>
        <Spline
          scene="https://prod.spline.design/vtpcM05F3xx32Nws/scene.splinecode"
          onLoad={handleSplineLoad}
          onMouseDown={handleSplineMouseDown}
        />
      </div>

      {/* Transparent overlay button for navigation */}
      <button
        onClick={() => navigate('/exchange')}
        style={overlayButtonStyles}
      ></button>

      {/* Loading indicator */}
      {isSplineLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          zIndex: 5,
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: `4px solid transparent`,
            borderTop: `4px solid ${colors.mainAccentColor}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Decorative gradient shapes */}
      <div style={gradientShape1Styles}></div>
      <div style={gradientShape2Styles}></div>
      <div style={gradientShape3Styles}></div>
      <div style={gradientShape4Styles}></div>
      <div style={gradientShape5Styles}></div>

      <div style={heroSectionStyles}>
      </div>
    </div>
  );
};

