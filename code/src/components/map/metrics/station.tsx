import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { Complaint, ComplaintStatus, StationScores } from 'types';

/**
 * The content of the complaint information metric tab.
 */
export default function MetricStationProfile({
  complaint,
  scores
}: MetricComplaintInfoProps) {
  const [chartData, setChartData] = useState<ChartDataModel>();
  const [metrics, setMetrics] = useState<Array<MapMetric>>([]);

  useEffect(() => {
    calculateMetrics();
  }, [complaint?.id]);

  /**
   * Calculate the metrics for the complaint's station and sets the chart data.
   */
  const calculateMetrics = () => {
    if (!complaint) return;

    const score = scores[complaint.station!];
    const metrics = [
      {
        color: '#0f007d',
        label: ComplaintStatus.RESOLVED,
        number: score.numberOfComplaintsResolved!
      },
      {
        color: '#7d0188',
        label: ComplaintStatus.ADDRESSED,
        number: score.numberOfComplaintsAddressed!
      },
      {
        color: '#7d0015',
        label: ComplaintStatus.UNADDRESSED,
        number: score.numberOfComplaintsUnaddressed!
      }
    ];
    setMetrics(metrics);

    const dataset: ChartDatasetModel = {
      data: [],
      backgroundColor: []
    };
    const labels: Array<string> = [];

    metrics.forEach(({ color, label, number }) => {
      dataset.data.push(number);
      dataset.backgroundColor.push(color);
      labels.push(label);
    });

    setChartData({ datasets: [dataset], labels });
  };

  return (
    <div className={'map-metrics-content--station'}>
      <Doughnut
        type={'doughnut'}
        data={chartData}
        options={{
          plugins: {
            legend: {
              display: false
            }
          }
        }}
      />
      <div className={'map-metrics-legend'}>
        {metrics.map(({ color, label, number }, key) => {
          return (
            <div className={'map-metrics-legend__key'} key={key}>
              <span>
                <svg width={10} height={10}>
                  <circle cx={5} cy={5} r={5} fill={color} />
                </svg>
              </span>
              <span>{label}</span>
              <span className={'map-metrics-legend__key-number'}>{number}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface MapMetric {
  color: string;
  label: ComplaintStatus;
  number: number;
}

interface ChartDataModel {
  datasets: Array<ChartDatasetModel>;
  labels: Array<string>;
}

interface ChartDatasetModel {
  data: Array<number>;
  backgroundColor: Array<string>;
}

interface MapMetricsProps {
  complaint: Complaint;
  scores: StationScores;
}

type MetricComplaintInfoProps = MapMetricsProps;
