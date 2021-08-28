import React from 'react';

const POSITION = 21;
const RADIUS = 16;
const STROKE_WIDTH = 8;
const GAP_FACTOR = 2.65;

export function DoughnutChart({ data, score }: DoughnutChartData) {
  const total = data.reduce((a, b) => a + b.value, 0);
  let strokeDashOffset = 25;
  let strokeGapCount = data.length - GAP_FACTOR;

  return (
    <svg width={'100%'} height={'100%'} viewBox={'0 0 42 42'}>
      <text
        x={'50%'}
        y={'50%'}
        textAnchor={'middle'}
        dy={'.3em'}
        className={'doughnut-score'}>
        {score}%
      </text>
      {data.map(({ color, value }, key) => {
        if (!value) {
          if (strokeGapCount) strokeGapCount = 0;
          return (
            <circle
              cx={POSITION}
              cy={POSITION}
              r={RADIUS}
              fill={'transparent'}
              stroke={'transparent'}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={'100 0'}
              strokeDashoffset={strokeDashOffset}
              className={'doughnut-arc'}
              key={key}
            />
          );
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
            className={'doughnut-arc'}
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
  score?: number;
}
