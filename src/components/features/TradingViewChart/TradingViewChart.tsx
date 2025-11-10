import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

export interface TradingViewChartProps {
  symbol?: string;
  interval?: string;
  theme?: 'light' | 'dark';
  containerId?: string;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol = 'BINANCE:WIFUSDT',
  interval = '1',
  theme = 'dark',
  containerId = 'tradingview-chart'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    const loadTradingViewScript = () => {
      return new Promise<void>((resolve, reject) => {
        // Check if script already exists
        const existingScript = document.getElementById('tradingview-script');
        if (existingScript) {
          if (window.TradingView) {
            resolve();
          } else {
            existingScript.addEventListener('load', () => resolve());
            existingScript.addEventListener('error', () => reject(new Error('Failed to load TradingView script')));
          }
          return;
        }

        // Create and load script
        const script = document.createElement('script');
        script.id = 'tradingview-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load TradingView script'));
        document.head.appendChild(script);
      });
    };

    const initializeWidget = () => {
      if (!containerRef.current || !window.TradingView) return;

      // Clear any existing content to destroy old widget
      containerRef.current.innerHTML = '';

      try {
        // Create new widget with updated symbol
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: interval,
          timezone: 'Etc/UTC',
          theme: theme,
          style: '1', // Candlestick chart
          locale: 'en',
          enable_publishing: false,
          allow_symbol_change: false,
          hide_legend: true,
          save_image: false,
          container_id: containerId,
          // Additional settings for better appearance
          toolbar_bg: '#0F0F0F',
          hide_side_toolbar: false,
          studies: [],
          show_popup_button: false,
          popup_width: '1000',
          popup_height: '650'
        });

        scriptLoadedRef.current = true;
      } catch (error) {
        console.error('Error initializing TradingView widget:', error);
      }
    };

    // Load script and initialize widget
    loadTradingViewScript()
      .then(() => {
        // Slight delay to ensure proper cleanup
        setTimeout(() => {
          initializeWidget();
        }, 100);
      })
      .catch((error) => {
        console.error('Error loading TradingView:', error);
      });

    // Cleanup function - destroys widget when symbol changes or component unmounts
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, interval, theme, containerId]);

  return (
    <div 
      ref={containerRef}
      id={containerId}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    />
  );
};

