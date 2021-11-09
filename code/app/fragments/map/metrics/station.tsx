import { ComplaintStatus, Station, StationScores } from '@munity/utils';
import React, { useEffect, useMemo, useState } from 'react';

import { DoughnutChart } from 'components/chart/doughnut';
import Timeline from 'components/chart/timeline';

/**
 * The content of the station metric tab.
 */
export default function MetricStationProfile({
  stationName,
  scores
}: MetricStationProps) {
  const [station, setStation] = useState<Station>();

  useEffect(() => {
    const station = scores[stationName!];
    setStation(station);
  }, [stationName, scores]);

  /**
   * Calculates the metrics for the complaint's station.
   */
  const metrics = useMemo(() => {
    if (!station) return [];
    return [
      {
        color: '#13b835',
        label: ComplaintStatus.RESOLVED,
        number: station.numberOfComplaintsResolved!
      },
      {
        color: '#d2d200',
        label: ComplaintStatus.INVESTIGATING,
        number: station.numberOfComplaintsInvestigating!
      },
      {
        color: '#ce1e1e',
        label: ComplaintStatus.UNADDRESSED,
        number: station.numberOfComplaintsUnaddressed!
      }
    ];
  }, [station]);

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
    if (!station) return [];
    return [
      {
        label: 'Total No. of Complaints',
        value: station.totalNumberOfComplaints
      },
      {
        label: 'Avg. Investigation Time',
        value: station.averageInvestigationTime ?? 'N/A'
      },
      {
        label: 'Avg. Resolution Time',
        value: station.averageResolutionTime ?? 'N/A'
      },
      {
        label: 'Avg. Case Duration',
        value: station.averageCaseDuration ?? 'N/A'
      }
    ];
  }, [station]);

  return (
    <section className={'map-metrics-content--station'}>
      <h1>{stationName}</h1>
      <figure className={'doughnut'}>
        <DoughnutChart data={chartData} score={station?.finalScore} />
        <figcaption>
          <ChartLegend metrics={metrics} />
        </figcaption>
      </figure>
      <Timeline station={station!} stationName={stationName!} />
      <section className={'station-stats'}>
        <table>
          <tbody>
            {fields.map(({ label, value }, key) => {
              return (
                <tr key={key}>
                  <td className={'station-stats--label'}>{label}:</td>
                  <td className={'station-stats--values'}>{value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
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
              <td className={'map-metrics-legend__key'}>
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
  stationName?: string;
  scores: StationScores;
}

interface ChartKeyProps {
  metrics: Array<MapMetric>;
}
