import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { ChartDataPoint } from '../types';

interface EquityChartProps {
  data: ChartDataPoint[];
  highlightedAgent?: string | null;
  onChartClick?: (agentName: string) => void;
  theme?: 'dark' | 'light';
}

const EquityChart: React.FC<EquityChartProps> = ({ data, highlightedAgent, onChartClick, theme = 'dark' }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const resizeRequestId = useRef<number | null>(null);

  // Artistic Color Palette (Muted, Elegant)
  const AGENT_COLORS = [
      '#C5A059', // Antique Gold
      '#E07A5F', // Terracotta
      '#8DA399', // Sage Green
      '#6D7E8C', // Slate Blue
      '#D4B483', // Champagne
      '#BC8034', // Bronze
      '#8F5D5D', // Rosewood
      '#5F6F65', // Olive
  ];

  const LIGHT_AGENT_COLORS = AGENT_COLORS.map(c => c);

  useEffect(() => {
    if (!chartRef.current) return;
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const resizeObserver = new ResizeObserver(() => {
        if (resizeRequestId.current !== null) return;
        resizeRequestId.current = requestAnimationFrame(() => {
            chartInstance.current?.resize();
            resizeRequestId.current = null;
        });
    });
    resizeObserver.observe(chartRef.current);

    chartInstance.current.on('click', (params) => {
        if (params.componentType === 'series' && onChartClick) {
            onChartClick(params.seriesName as string);
        }
    });

    return () => {
      if (resizeRequestId.current !== null) cancelAnimationFrame(resizeRequestId.current);
      resizeObserver.disconnect();
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  useEffect(() => {
      if (!chartInstance.current) return;
      chartInstance.current.off('click');
      chartInstance.current.on('click', (params) => {
          if (params.componentType === 'series' && onChartClick) {
              onChartClick(params.seriesName as string);
          }
      });
  }, [onChartClick]);

  useEffect(() => {
    if (!chartInstance.current || data.length === 0) return;

    const isLight = theme === 'light';
    const textColor = isLight ? '#2C2C2C' : '#A1A1AA';
    const tooltipBg = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 30, 30, 0.9)';
    const tooltipText = isLight ? '#111827' : '#E8E6E3';
    
    const userColor = '#C5A059'; // Gold for user

    const times = data.map(d => d.time);
    const seriesKeys = Object.keys(data[data.length - 1] || {}).filter(k => k !== 'time');
    const colors = isLight ? LIGHT_AGENT_COLORS : AGENT_COLORS;

    const series = seriesKeys.map((key, index) => {
      const isHighlighted = highlightedAgent === key;
      const isAnyHighlighted = !!highlightedAgent;
      const isDimmed = isAnyHighlighted && highlightedAgent !== key;

      const color = colors[index % colors.length];

      let width = 2;
      let z = 2;
      let opacity = 0.8;

      if (isDimmed) {
          opacity = 0.1;
          z = 1;
      } else if (isHighlighted) {
          width = 3;
          z = 30;
          opacity = 1;
      } 

      return {
        name: key,
        type: 'line',
        data: data.map(d => d[key]),
        smooth: true,
        symbol: 'none', 
        lineStyle: {
          color: color,
          width: width,
          shadowBlur: isHighlighted ? 10 : 0,
          shadowColor: color
        },
        // Gradient area fill for artistic touch
        areaStyle: isHighlighted ? {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: color },
                { offset: 1, color: 'transparent' }
            ]),
            opacity: 0.1
        } : undefined,
        endLabel: {
          show: true,
          formatter: (params: any) => `{a|${params.seriesName}}`,
          color: isDimmed ? 'transparent' : color,
          fontFamily: 'Inter, "Noto Sans SC", sans-serif',
          fontSize: 11,
          offset: [5, 0],
          rich: {
            a: {
              padding: [2, 4],
              borderRadius: 4,
              backgroundColor: isDimmed ? 'transparent' : (isLight ? 'rgba(255,255,255,0.9)' : 'rgba(30,30,30,0.8)'),
              color: color,
              fontWeight: 'bold'
            }
          }
        },
        itemStyle: { color },
        z: z,
        opacity: opacity,
        triggerLineEvent: true,
        emphasis: {
            focus: 'series',
            lineStyle: { width: 3 }
        }
      };
    });

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      grid: {
        top: 30,
        right: 120, 
        bottom: 30,
        left: 50,
        containLabel: false
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: tooltipBg,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 12,
        textStyle: {
          color: tooltipText,
          fontFamily: 'Inter, "Noto Sans SC", sans-serif',
          fontSize: 13
        },
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: 'rgba(197, 160, 89, 0.5)',
            width: 1,
            type: 'solid'
          }
        },
        formatter: (params: any) => {
            let res = `<div style="font-family: 'Inter', 'Noto Sans SC', sans-serif; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px; margin-bottom: 6px; color: ${tooltipText}">${params[0].axisValue}</div>`;
            const sortedParams = params.sort((a: any, b: any) => b.value - a.value);
            
            let count = 0;
            sortedParams.forEach((item: any) => {
                const profit = (item.value - 100).toFixed(2);
                const isSelected = item.seriesName === highlightedAgent;
                
                if (isSelected || count < 8) {
                     const color = item.color;
                    const fontWeight = isSelected ? 'bold' : 'normal';
                    const nameColor = isSelected ? userColor : tooltipText;
                    const profitColor = parseFloat(profit) > 0 ? (isLight ? '#B08D55' : '#C5A059') : (isLight ? '#C45F45' : '#E07A5F');
                    
                    res += `<div style="display: flex; justify-content: space-between; gap: 15px; color: ${nameColor}; font-weight: ${fontWeight}; padding: 2px 0;">
                            <span><span style="display:inline-block;margin-right:6px;border-radius:50%;width:8px;height:8px;background-color:${color};"></span>${item.seriesName}</span>
                            <span style="color:${profitColor}">${parseFloat(profit) > 0 ? '+' : ''}${profit}%</span>
                            </div>`;
                    count++;
                }
            });
            return res;
        }
      },
      xAxis: {
        type: 'category',
        data: times,
        axisLine: { show: false }, // Hide axis line
        axisTick: { show: false },
        axisLabel: { color: textColor, fontFamily: 'Inter, "Noto Sans SC", sans-serif', fontSize: 11 },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLabel: { 
            color: textColor, 
            fontFamily: 'Inter, "Noto Sans SC", sans-serif', 
            fontSize: 11,
            formatter: (value: number) => `${(value - 100).toFixed(0)}%`
        },
        axisLine: { show: false },
        splitLine: { 
          show: true,
          lineStyle: { color: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', type: 'dashed' } 
        }
      },
      series: series as any
    };

    chartInstance.current.setOption(option);
  }, [data, highlightedAgent, theme]);

  return <div ref={chartRef} className="w-full h-full min-h-[300px]" />;
};

export default EquityChart;