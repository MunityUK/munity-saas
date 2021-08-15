import React from 'react';

const POSITION = 21;
const RADIUS = 15;
const STROKE_WIDTH = 6;

export function DoughnutChart({ data }: DoughnutChartData) {
  const total = data.reduce((a, b) => a + b.value, 0);
  let strokeDashOffset = 0;

  return (
    <svg width={'100%'} height={'100%'} viewBox={'0 0 42 42'}>
      <circle cx={POSITION} cy={POSITION} r={RADIUS} fill={'#fff'} />
      <circle
        cx={POSITION}
        cy={POSITION}
        r={RADIUS}
        fill={'transparent'}
        stroke={'#d2d3d4'}
        strokeWidth={STROKE_WIDTH}
      />
      {data.map(({ color, value }, key) => {
        const pctValue = (value / total) * 100;
        const pctRemnant = 100 - pctValue;
        const strokeDashArray = `${pctValue} ${pctRemnant}`;
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
