'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Chart } from '@antv/g2';
import type { ChartDataPoint } from '@/types';

interface EquityChartProps {
  data: ChartDataPoint[];
  highlightedAgent?: string | null;
  onChartClick?: (agentName: string) => void;
  theme?: 'dark' | 'light';
}

const AGENT_COLORS = [
  '#C5A059',
  '#E07A5F',
  '#8DA399',
  '#6D7E8C',
  '#D4B483',
  '#BC8034',
  '#8F5D5D',
  '#5F6F65'
];

type FlattenedPoint = {
  time: string;
  agent: string;
  value: number;
};

export default function EquityChart({
  data,
  highlightedAgent,
  onChartClick,
  theme = 'dark'
}: EquityChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const flattenedData = useMemo<FlattenedPoint[]>(() => {
    const rows: FlattenedPoint[] = [];
    data.forEach((point) => {
      const { time, ...series } = point;
      Object.entries(series).forEach(([agent, value]) => {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return;
        rows.push({ time, agent, value: numeric });
      });
    });
    return rows;
  }, [data]);

  const seriesOrder = useMemo(() => {
    if (!data.length) return [] as string[];
    const { time, ...rest } = data[data.length - 1];
    return Object.keys(rest);
  }, [data]);

  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    seriesOrder.forEach((agent, index) => {
      map[agent] = AGENT_COLORS[index % AGENT_COLORS.length];
    });
    return map;
  }, [seriesOrder]);

  useEffect(() => {
    if (!chartRef.current) return;
    chartInstance.current = new Chart({
      container: chartRef.current,
      autoFit: true,
      height: chartRef.current.clientHeight || 320,
      padding: [24, 90, 40, 55]
    });

    return () => {
      chartInstance.current?.destroy();
      chartInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current) return;
    const chart = chartInstance.current;

    if (!flattenedData.length) {
      chart.options({ type: 'view', children: [] });
      chart.render();
      return;
    }

    const isLight = theme === 'light';
    const labelColor = isLight ? '#2C2C2C' : '#A7ADB8';
    const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)';

    const baseChildren: any[] = [
      {
        type: 'line',
        data: flattenedData,
        encode: {
          x: 'time',
          y: 'value',
          color: 'agent',
          series: 'agent'
        },
        scale: {
          color: {
            domain: seriesOrder,
            range: seriesOrder.map((agent) => colorMap[agent])
          }
        },
        style: {
          lineWidth: (datum: FlattenedPoint) =>
            highlightedAgent ? (datum.agent === highlightedAgent ? 3 : 1) : 2,
          opacity: (datum: FlattenedPoint) =>
            highlightedAgent
              ? datum.agent === highlightedAgent
                ? 1
                : 0.25
              : 0.95
        },
        tooltip: {
          title: 'time',
          items: [
            { channel: 'color' },
            {
              channel: 'y',
              valueFormatter: (value: number) =>
                `${Number.isFinite(value) ? (value - 100).toFixed(2) : '0'}%`
            }
          ]
        }
      }
    ];

    if (highlightedAgent && colorMap[highlightedAgent]) {
      baseChildren.push({
        type: 'area',
        data: flattenedData.filter((row) => row.agent === highlightedAgent),
        encode: {
          x: 'time',
          y: 'value'
        },
        style: {
          fill: colorMap[highlightedAgent],
          fillOpacity: 0.12
        }
      });
    }

    chart.options({
      type: 'view',
      data: flattenedData,
      padding: [24, 90, 40, 55],
      scale: {
        value: {
          nice: true
        },
        color: {
          domain: seriesOrder,
          range: seriesOrder.map((agent) => colorMap[agent])
        }
      },
      axis: {
        x: {
          tick: false,
          title: null,
          style: {
            labelFill: labelColor,
            labelFontSize: 11
          }
        },
        y: {
          title: null,
          style: {
            labelFill: labelColor,
            gridStroke: gridColor,
            gridLineDash: [4, 4],
            labelFontSize: 11
          },
          labelFormatter: (value: number) => `${(value - 100).toFixed(0)}%`
        }
      },
      tooltip: {
        title: 'time'
      },
      children: baseChildren
    });

    chart.render();

    chart.off('element:click');
    chart.on('element:click', (event) => {
      const agent = event.data?.data?.agent;
      if (agent && onChartClick) {
        onChartClick(agent);
      }
    });
  }, [
    flattenedData,
    highlightedAgent,
    onChartClick,
    theme,
    seriesOrder,
    colorMap
  ]);

  return <div ref={chartRef} className='w-full h-full min-h-[300px]' />;
}
