import { Station } from '@munity/utils';
import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

export const chartOptions: ApexOptions = {
  chart: {
    type: 'line',
    toolbar: {
      show: false
    }
  },
  title: {
    text: 'Score Over Time',
    align: 'center'
  },
  tooltip: {
    enabled: true,
    marker: {
      show: false
    }
  },
  xaxis: {
    tickAmount: 5
  },
  yaxis: {
    // decimalsInFloat: 0,
    labels: {
      formatter(val) {
        return Math.round(val).toString();
      }
    },
    tickAmount: 5,
    max: 100,
    min: 0
  }
};

export default function Timeline({ station, stationName }: TimelineProps) {
  const [state, setState] = useState<ChartState>({
    data: [],
    xAxis: []
  });

  useEffect(() => {
    if (station && station.complaints && stationName) {
      const scores = Station.trackScores(
        station.complaints!,
        new Date(2021, 1, 0),
        new Date()
      )[stationName];

      if (scores) {
        setState({
          data: Object.values(scores),
          xAxis: Object.keys(scores)
        });
      }
    }
  }, [station, stationName]);

  return (
    <figure className={'linechart'}>
      <Chart
        options={{
          ...chartOptions,
          labels: state.xAxis
        }}
        height={'350'}
        series={[
          {
            name: 'Score',
            data: state.data
          }
        ]}
      />
    </figure>
  );
}

interface TimelineProps {
  station: Station;
  stationName: string;
}

type ChartState = {
  data: number[];
  xAxis: string[];
};
