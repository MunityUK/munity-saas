import { Station } from '@munity/utils';
import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const MIN_DATE = new Date(2021, 0, 1).getTime();
const MAX_DATE = new Date().getTime();

const chartOptions: ApexOptions = {
  chart: {
    redrawOnParentResize: true,
    redrawOnWindowResize: true,
    selection: {
      enabled: false
    },
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
    },
    x: {
      format: 'MMMM yyyy'
    }
  },
  xaxis: {
    type: 'datetime',
    min: MIN_DATE,
    max: MAX_DATE,
    tooltip: {
      enabled: false
    }
  },
  yaxis: {
    decimalsInFloat: 0,
    tickAmount: 5,
    max: 100,
    min: 0
  }
};

export default function LineChart({ station, stationName }: TimelineProps) {
  const [state, setState] = useState<ChartState>({
    data: [],
    xAxis: []
  });

  useEffect(() => {
    if (station && station.complaints && stationName) {
      const scores = Station.trackScores(
        station.complaints!,
        new Date(MIN_DATE),
        new Date(MAX_DATE)
      )[stationName];

      if (scores) {
        const data: ChartState['data'] = [];
        const months: ChartState['xAxis'] = [];

        Object.entries(scores).forEach(([date, score]) => {
          const [, year, month] = date.match(/([0-9]+)\-([0-9]+)/)!;
          const formattedDate = new Date(
            parseInt(year),
            parseInt(month)
          ).getTime();
          data.push([formattedDate, score]);
          months.push(new Date(formattedDate));
        });

        setState({
          data,
          xAxis: months
        });
      }
    }
  }, [station, stationName]);

  return (
    <figure className={'linechart'}>
      <Chart
        height={'350'}
        options={chartOptions}
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
  station: Station | undefined;
  stationName: string | undefined;
}

type ChartState = {
  data: [number, number][];
  xAxis: Date[];
};
