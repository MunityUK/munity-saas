import React from 'react';

const POSITION = 21;
const RADIUS = 16;
const STROKE_WIDTH = 8;

export function DoughnutChart({ data }: DoughnutChartData) {
  const total = data.reduce((a, b) => a + b.value, 0);
  let strokeDashOffset = 22.5;
  let strokeGapCount = data.length - 2;

  return (
    <svg width={'100%'} height={'100%'} viewBox={'0 0 42 42'}>
      {data.map(({ color, value }, key) => {
        if (!value) {
          if (strokeGapCount) strokeGapCount--;
          return null;
        }

        const strokeMax = 100 - strokeGapCount;
        const pctValue = (value / total) * strokeMax;
        const pctRemnant = strokeMax - pctValue;
        const strokeDashArray = `${pctValue - strokeGapCount} ${
          pctRemnant + strokeGapCount
        }`;
        if (key > 0) {
          strokeDashOffset += pctValue;
        }
        return (
          <circle
            cx={POSITION}
            cy={POSITION}
            r={RADIUS}
            fill={'transparent'}
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={strokeDashArray}
            strokeDashoffset={strokeDashOffset}
            key={key}
          />
        );
      })}
    </svg>
  );
}

interface DoughnutChartData {
  data: Array<{
    color: string;
    value: number;
  }>;
}
