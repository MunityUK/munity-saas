import React, { ReactNode, useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { Complaint, ComplaintStatus, StationScore, StationScores } from 'types';

/**
 * The content of the complaint information metric tab.
 */
export default function MetricStationProfile({
  complaint,
  scores
}: MetricComplaintInfoProps) {
  if (!complaint) return null;
  
  const [chartData, setChartData] = useState<ChartDataModel>();
  const [fields, setFields] = useState<Array<ScoreField>>([]);
  const [metrics, setMetrics] = useState<Array<MapMetric>>([]);

  useEffect(() => {
    const score = scores[complaint.station!];
    calculateMetrics(score);
    collateFields(score);
  }, [complaint?.id]);

  /**
   * Calculate the metrics for the complaint's station and sets the chart data.
   * @param score The station score.
   */
  const calculateMetrics = (score: StationScore) => {
    if (!complaint) return;

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

  /**
   * Builds the list of fields to display.
   * @param score The station score.
   */
  const collateFields = (score: StationScore) => {
    const fields = [
      { label: 'Station', value: complaint.station },
      { label: 'Score', value: score.finalScore },
      {
        label: 'Total Number of Complaints',
        value: score.totalNumberOfComplaints
      },
      { label: 'Avg. Addressal Time', value: score.averageAddressalTime },
      { label: 'Avg. Resolution Time', value: score.averageResolutionTime },
      { label: 'Avg. Case Duration', value: score.averageCaseDuration }
    ];
    setFields(fields);
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
      <ChartKey metrics={metrics} />
      {fields.map(({ label, value }, key) => {
        return (
          <div className={'complaint-field'} key={key}>
            <label>{label}:</label>
            <div>{value}</div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * The key for the doughnut chart.
 */
function ChartKey({ metrics }: ChartKeyProps) {
  return (
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

interface ScoreField {
  label: string;
  value: ReactNode;
}

interface MapMetricsProps {
  complaint: Complaint;
  scores: StationScores;
}

interface ChartKeyProps {
  metrics: Array<MapMetric>;
}

type MetricComplaintInfoProps = MapMetricsProps;
