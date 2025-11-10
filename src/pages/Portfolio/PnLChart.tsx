import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, BaselineSeries } from 'lightweight-charts';
import { colors } from '../../theme';

export interface PnLDataPoint {
  time: string; // ISO date string or timestamp
  value: number; // PnL amount
}

export interface PnLChartProps {
  data: PnLDataPoint[];
  height?: number;
  title?: string;
}

export const PnLChart: React.FC<PnLChartProps> = ({ 
  data, 
  height = 300
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const positiveSeriesRef = useRef<any>(null); // Store positive series reference
  const negativeSeriesRef = useRef<any>(null); // Store negative series reference
  const chartDataRef = useRef<Array<{ time: number; value: number }>>([]); // Store current chart data for ResizeObserver
  const adjustedVisibleRangeRef = useRef<{ from: number; to: number } | null>(null); // Store adjusted visible range
  const [isChartReady, setIsChartReady] = useState(false);
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; value: string; time: string } | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }

    // Initialize chart directly when container is available
      if (!chartContainerRef.current) {
        return;
      }

    try {
      const container = chartContainerRef.current;

      // Ensure container has explicit dimensions before chart creation
      if (container.clientWidth === 0 || container.clientHeight === 0) {
        return;
      }

      // Create chart with autoSize enabled - don't include width/height when using autoSize
      const chart = createChart(container, {
        autoSize: true, // Automatically resize to container using ResizeObserver
        layout: {
          background: { type: ColorType.Solid, color: colors.mainBackgroundColor },
          textColor: colors.mainTextColor,
          fontSize: 12,
        },
        grid: {
          vertLines: { visible: false }, // Hide all grid lines
          horzLines: { visible: false },
        },
        rightPriceScale: {
          visible: false, // Hide price scale completely
          borderVisible: false,
          autoScale: true,
          mode: 0, // Normal mode
          alignLabels: true,
          scaleMargins: {
            top: 0.1,
            bottom: 0.1,
          },
        },
        leftPriceScale: {
          visible: false,
          borderVisible: false,
          autoScale: true,
          mode: 0, // Normal mode
          alignLabels: true,
          scaleMargins: {
            top: 0.1,
            bottom: 0.1,
          },
        },
        timeScale: {
          visible: false, // Hide time scale completely
          barSpacing: 0, // No spacing between bars
          minBarSpacing: 0, // No minimum spacing
          borderVisible: false,
          rightOffset: 0,
        },
        crosshair: {
          mode: 1, // Normal crosshair
          vertLine: {
            color: colors.secondaryTextColor, // Subtle white/grey
            width: 1,
            style: 2, // Dashed
          },
          horzLine: {
            visible: false, // Hide horizontal line
          },
        },
      });

      // autoSize handles resizing automatically, no manual ResizeObserver needed
      // However, we need a ResizeObserver to re-anchor the chart to the left edge on resize
      let resizeObserver: ResizeObserver | null = null;

      // IMPORTANT: Sort data and use Unix timestamps for precision
      const chartData = data
        .map(point => ({
          time: Math.floor(new Date(point.time).getTime() / 1000), // Unix timestamp in seconds
          value: point.value
        }))
        .sort((a, b) => a.time - b.time); // Sort by timestamp

      // Use BaselineSeries - fills between the line and a baseline value (0)
      // This allows proper gradient fills both above and below zero
      const baselineSeries = chart.addSeries(BaselineSeries, {
        baseValue: { 
          type: 'price', 
          price: 0 
        },
        lineWidth: 2,
        // Above baseline (positive values) - gradient from green line to transparent at zero
        topLineColor: colors.successBright,
        topFillColor1: colors.successBright + '40',  // Color at the TOP (the line)
        topFillColor2: 'transparent',                // Transparent at the baseline (0)
        
        // Below baseline (negative values) - gradient from red line to transparent at zero
        bottomLineColor: colors.errorColor,
        bottomFillColor1: colors.errorColor + '40',  // Color at the BOTTOM (the line)
        bottomFillColor2: 'transparent',             // Transparent at the baseline (0)
        
        priceLineVisible: false,
        lastValueVisible: false,
      });

      // Set data for baseline series
      (baselineSeries as any).setData(chartData);

      // Store series reference
      seriesRef.current = baselineSeries;
      positiveSeriesRef.current = baselineSeries; // For compatibility with tooltip code
      negativeSeriesRef.current = baselineSeries; // For compatibility with tooltip code
      
      // Add horizontal dotted line at y=0 (zero line) - add to baseline series
      (baselineSeries as any).createPriceLine({
        price: 0,
        color: colors.secondaryTextColor + '60', // More transparent (60 = ~37% opacity)
        lineWidth: 1,
        lineStyle: 3, // Large dashed line (fewer dashes, more space)
        axisLabelVisible: false,
        title: '',
      });
      
      // Store current chart data in ref so ResizeObserver always has latest data
      chartDataRef.current = chartData;

      // Anchor chart to left edge by setting visible range starting from first data point
      // This prevents the chart content from shifting left when container resizes
      const anchorToLeftEdge = () => {
        if (chartData.length > 0) {
          try {
            const firstTime = chartData[0].time as any;
            const lastTime = chartData[chartData.length - 1].time as any;
            // Set visible range to start at the first time point to anchor left edge
            chart.timeScale().setVisibleRange({
              from: firstTime,
              to: lastTime
            });
            
            // Get the coordinate of the first data point and adjust visible range to place it at x=0
            try {
              // Wait a frame for the chart to render after setVisibleRange
              requestAnimationFrame(() => {
                try {
                  const coordinate = chart.timeScale().timeToCoordinate(firstTime);
                  
                  // If the coordinate is not at 0, adjust the visible range to compensate
                  if (typeof coordinate === 'number' && coordinate !== 0 && coordinate > 0) {
                    
                    // Calculate how many pixels the first point is offset
                    const pixelOffset = coordinate;
                    
                    // Convert pixel offset to time offset
                    // We need to find what time would be at x=0
                    // Get the time range currently visible
                    const currentRange = chart.timeScale().getVisibleRange();
                    if (currentRange && typeof currentRange.from === 'number' && typeof currentRange.to === 'number') {
                      const timeRange = currentRange.to - currentRange.from;
                      // Calculate seconds per pixel (not pixels per second)
                      const secondsPerPixel = timeRange / container.clientWidth;
                      
                      // Calculate how much time we need to shift back to move first point to x=0
                      const timeOffset = pixelOffset * secondsPerPixel;
                      
                      // Adjust the visible range to shift everything left
                      const adjustedFrom = currentRange.from - timeOffset;
                      const adjustedTo = currentRange.to - timeOffset;
                      
                      // Store the adjusted range so ResizeObserver can use it
                      adjustedVisibleRangeRef.current = { from: adjustedFrom, to: adjustedTo };
                      
                      chart.timeScale().setVisibleRange({
                        from: adjustedFrom as any,
                        to: adjustedTo as any
                      });
                      
                      // Verify after adjustment - may need multiple iterations
                      requestAnimationFrame(() => {
                        const newCoordinate = chart.timeScale().timeToCoordinate(firstTime);
                        
                        // If still not at x=0 and offset is significant, try one more iteration
                        if (typeof newCoordinate === 'number' && Math.abs(newCoordinate) > 1) {
                          const finalTimeRange = adjustedTo - adjustedFrom;
                          const finalSecondsPerPixel = finalTimeRange / container.clientWidth;
                          const finalTimeOffset = newCoordinate * finalSecondsPerPixel;
                          const finalAdjustedFrom = adjustedFrom - finalTimeOffset;
                          const finalAdjustedTo = adjustedTo - finalTimeOffset;
                          
                          adjustedVisibleRangeRef.current = { from: finalAdjustedFrom, to: finalAdjustedTo };
                          
                          chart.timeScale().setVisibleRange({
                            from: finalAdjustedFrom as any,
                            to: finalAdjustedTo as any
                          });
                        }
                      });
                    }
                  }
                } catch (e) {
                  // Silent fail
                }
              });
            } catch (e) {
              // Silent fail
            }
          } catch (e) {
            // Silent fail
          }
        }
      };

      // Initial anchor after data is set
      requestAnimationFrame(() => {
        anchorToLeftEdge();
      });

      chartRef.current = chart;
      setIsChartReady(true);

      // Create ResizeObserver to re-anchor chart to left edge when container resizes
      // Uses adjusted visible range if available, otherwise uses original data times
      resizeObserver = new ResizeObserver(() => {
        // When container resizes, re-anchor to left edge using adjusted range if we have it
        requestAnimationFrame(() => {
          if (chartRef.current && chartDataRef.current.length > 0) {
            try {
              // Use adjusted range if we have it, otherwise use original data times
              let fromTime: number;
              let toTime: number;
              
              if (adjustedVisibleRangeRef.current) {
                // Use the adjusted range that positions first point at x=0
                fromTime = adjustedVisibleRangeRef.current.from;
                toTime = adjustedVisibleRangeRef.current.to;
              } else {
                // Fallback to original data times
                fromTime = chartDataRef.current[0].time as any;
                toTime = chartDataRef.current[chartDataRef.current.length - 1].time as any;
              }
              
              chartRef.current.timeScale().setVisibleRange({
                from: fromTime as any,
                to: toTime as any
              });
            } catch (e) {
              // Silent fail
            }
          }
        });
      });
      resizeObserver.observe(container);

      // Add crosshair subscription for tooltip
      chart.subscribeCrosshairMove((param) => {
        if (param.point === undefined || !param.time || param.point.x < 0 || param.point.x > chartContainerRef.current!.clientWidth || param.point.y < 0 || param.point.y > height) {
          setTooltip(null);
        } else {
          // Get value from baseline series
          const baselineValue = param.seriesData.get(baselineSeries);
          
          if (baselineValue) {
            const value = baselineValue;
            const date = new Date((param.time as number) * 1000);
            const formattedValue = (value as any).value >= 0 ? `+$${((value as any).value / 1000).toFixed(2)}K` : `-$${Math.abs((value as any).value / 1000).toFixed(2)}K`;
            const formattedTime = date.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric', 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            });
            
            setTooltip({
              visible: true,
              x: param.point.x,
              y: param.point.y - 60, // Position above cursor
              value: formattedValue,
              time: formattedTime
            });
          }
        }
      });

      // With autoSize: true, the chart automatically handles resizing via ResizeObserver
      // No manual resize handling needed

      // Return cleanup
      return () => {
        if (resizeObserver) {
          resizeObserver.disconnect();
          resizeObserver = null;
        }
        if (chart) {
          chart.remove();
          chartRef.current = null;
          seriesRef.current = null;
          positiveSeriesRef.current = null;
          negativeSeriesRef.current = null;
          setIsChartReady(false);
        }
      };
    } catch (error) {
      // Silent fail
    }
  }, [height, data]);

  // Update data when props change
  useEffect(() => {
    if (seriesRef.current && data && data.length > 0 && isChartReady) {
      try {
        // Sort data and use Unix timestamps for precision
        const chartData = data
          .map(point => ({
            time: Math.floor(new Date(point.time).getTime() / 1000), // Unix timestamp in seconds
            value: point.value
          }))
          .sort((a, b) => a.time - b.time); // Sort by timestamp
        
        // Update baseline series with all data
        (seriesRef.current as any).setData(chartData);
        
        // Update ref with current chart data
        chartDataRef.current = chartData;

        // Re-anchor to left edge after data update
        if (chartRef.current && chartData.length > 0) {
          requestAnimationFrame(() => {
            try {
              const firstTime = chartData[0].time as any;
              const lastTime = chartData[chartData.length - 1].time as any;
              chartRef.current?.timeScale().setVisibleRange({
                from: firstTime,
                to: lastTime
              });
            } catch (e) {
              // Silent fail
            }
          });
        }
      } catch (error) {
        // Silent fail
      }
    }
  }, [data, isChartReady]);

  return (
    <div style={{ 
      width: '100%', 
      height: `${height}px`, 
      position: 'relative',
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
    }}>
      <style>{`
        /* Ensure chart canvas is left-aligned */
        .tv-lightweight-charts {
          padding: 0 !important;
          margin: 0 !important;
          box-sizing: border-box !important;
          display: block !important;
          position: relative !important;
        }
        .tv-lightweight-charts canvas {
          display: block !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .tv-lightweight-charts .tv-lightweight-charts__pane-view {
          padding: 0 !important;
          margin: 0 !important;
          left: 0 !important;
        }
      `}</style>
      <div 
        ref={chartContainerRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 'clamp(4px, 0.5vw, 6px)',
          flex: '1 1 auto',
          minWidth: 0,
          minHeight: 0,
          alignSelf: 'stretch'
        }} 
      />
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.y,
            backgroundColor: colors.mainBackgroundColor, // Black background to match chart
            border: `1px solid ${colors.mainBorderColor}`,
            borderRadius: 'clamp(4px, 0.5vw, 6px)',
            padding: 'clamp(0.5rem, 1vw, 0.75rem)',
            color: colors.mainTextColor,
            fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap'
          }}
        >
          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
            {tooltip.value}
          </div>
          <div style={{ color: colors.secondaryTextColor, fontSize: 'clamp(0.625rem, 1.25vw, 0.75rem)' }}>
            {tooltip.time}
          </div>
        </div>
      )}
    </div>
  );
};