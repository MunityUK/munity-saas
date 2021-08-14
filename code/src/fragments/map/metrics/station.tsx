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
   * Calculates the metrics for the complaint's station and sets the chart data.
   * @param score The station score.
   */
  const calculateMetrics = (score: StationScore) => {
    if (!complaint) return;

    const metrics = buildMetrics(score);
    setMetrics(metrics);

    const dataset: ChartDatasetModel = {
      data: [],
      backgroundColor: []
    };
    const labels: Array<string> = [];

    metrics.forEach(({ color, label, number }) => {
      dataset.backgroundColor.push(color);
      dataset.data.push(number);
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
      { label: 'Score', value: score.finalScore },
      {
        label: 'Total Number of Complaints',
        value: score.totalNumberOfComplaints
      },
      {
        label: 'Avg. Addressal Time',
        value: score.averageAddressalTime ?? 'N/A'
      },
      {
        label: 'Avg. Resolution Time',
        value: score.averageResolutionTime ?? 'N/A'
      },
      { label: 'Avg. Case Duration', value: score.averageCaseDuration ?? 'N/A' }
    ];
    setFields(fields);
  };

  return (
    <section className={'map-metrics-content--station'}>
      <h1>{complaint.station}</h1>
      <figure>
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
        <figcaption>
          <ChartLegend metrics={metrics} />
        </figcaption>
      </figure>
      {fields.map(({ label, value }, key) => {
        return (
          <fieldset className={'complaint-field'} key={key}>
            <label>{label}:</label>
            <p>{value}</p>
          </fieldset>
        );
      })}
    </section>
  );
}

/**
 * The key for the doughnut chart.
 */
function ChartLegend({ metrics }: ChartKeyProps) {
  return (
    <table className={'map-metrics-legend'}>
      {metrics.map(({ color, label, number }, key) => {
        return (
          <tr key={key}>
            <td>
              <svg width={10} height={10}>
                <circle cx={5} cy={5} r={5} fill={color} />
              </svg>
            </td>
            <td>{label}</td>
            <td className={'map-metrics-legend__value'}>{number}</td>
          </tr>
        );
      })}
    </table>
  );
}

function buildMetrics(score: StationScore) {
  return [
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
