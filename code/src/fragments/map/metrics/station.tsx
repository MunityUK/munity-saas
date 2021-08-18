import React, { useEffect, useMemo, useState } from 'react';

import { DoughnutChart } from 'src/components/chart/doughnut';
import { ComplaintStatus, StationScore, StationScores } from 'types';

/**
 * The content of the station metric tab.
 */
export default function MetricStationProfile({
  station,
  scores
}: MetricStationProps) {
  if (!station) return null;

  const [score, setScore] = useState<StationScore>();

  useEffect(() => {
    const score = scores[station!];
    setScore(score);
  }, [station]);

  /**
   * Calculates the metrics for the complaint's station.
   */
  const metrics = useMemo(() => {
    if (!score) return [];
    return [
      {
        color: '#13b835',
        label: ComplaintStatus.RESOLVED,
        number: score.numberOfComplaintsResolved!
      },
      {
        color: '#d2d200',
        label: ComplaintStatus.ADDRESSED,
        number: score.numberOfComplaintsAddressed!
      },
      {
        color: '#ce1e1e',
        label: ComplaintStatus.UNADDRESSED,
        number: score.numberOfComplaintsUnaddressed!
      }
    ];
  }, [score]);

  /**
   * Sets the chart data using built metrics.
   */
  const chartData = useMemo(() => {
    if (!metrics) return [];
    return metrics.map(({ color, number }) => {
      return { color, value: number };
    });
  }, [metrics]);

  /**
   * Builds the list of fields to display.
   */
  const fields = useMemo(() => {
    if (!score) return [];
    return [
      {
        label: 'Total No. of Complaints',
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
      {
        label: 'Avg. Case Duration',
        value: score.averageCaseDuration ?? 'N/A'
      }
    ];
  }, [score]);

  return (
    <section className={'map-metrics-content--station'}>
      <h1>{station}</h1>
      <figure>
        <DoughnutChart data={chartData} score={score?.finalScore} />
        <figcaption>
          <ChartLegend metrics={metrics} />
        </figcaption>
      </figure>
      <table className={'station-stats'}>
        <tbody>
          {fields.map(({ label, value }, key) => {
            return (
              <tr key={key}>
                <td>{label}</td>
                <td className={'station-stats--values'}>{value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

/**
 * The key for the doughnut chart.
 */
function ChartLegend({ metrics }: ChartKeyProps) {
  return (
    <table className={'map-metrics-legend'}>
      <tbody>
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
      </tbody>
    </table>
  );
}

interface MapMetric {
  color: string;
  label: ComplaintStatus;
  number: number;
}

interface MetricStationProps {
  station?: string;
  scores: StationScores;
}

interface ChartKeyProps {
  metrics: Array<MapMetric>;
}
