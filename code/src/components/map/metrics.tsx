import classnames from 'classnames';
import React, { ReactNode, SetStateAction, useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { formatDate } from 'src/utils/helper';
import { Complaint, ComplaintStatus, SexLookup, StationScores } from 'types';

const METRIC_TABS = [
  {
    title: 'Complaint Info',
    value: 'complaint'
  },
  {
    title: 'Station Profile',
    value: 'station'
  }
];

/**
 * The pane showing metrics for a complaint.
 */
export default function MapMetrics({ complaint, scores }: MapMetricsProps) {
  const [selectedTab, setSelectedTab] = useState(METRIC_TABS[0].value);

  if (!complaint) return null;

  return (
    <div className={'map-metrics'}>
      <MetricTabs tabHook={[selectedTab, setSelectedTab]} />
      <div className={'map-metrics-content'}>
        {selectedTab === 'complaint' ? (
          <MetricComplaintInfo complaint={complaint} />
        ) : (
          <MetricStationProfile complaint={complaint} scores={scores} />
        )}
      </div>
    </div>
  );
}

/**
 * The tabs for switching between map metric content.
 */
function MetricTabs({ tabHook }: MetricTabsProps) {
  const [selectedTab, setSelectedTab] = tabHook;
  return (
    <div className={'map-metrics-tabs'}>
      {METRIC_TABS.map(({ title, value }, key) => {
        const isActive = selectedTab === value;
        const classes = classnames('map-metrics-tabs__button', {
          'map-metrics-tabs__button--active': isActive
        });
        return (
          <label className={classes} key={key}>
            <input
              type={'checkbox'}
              name={'metric-tab'}
              value={value}
              onChange={() => setSelectedTab(value)}
              checked={isActive}
              hidden={true}
            />
            <span className={'map-metrics-tabs__button-text'}>{title}</span>
          </label>
        );
      })}
    </div>
  );
}

function MetricComplaintInfo({ complaint }: MetricStationProfileProps) {
  const fields: Array<ComplaintField> = [
    { label: 'ID', value: complaint.id },
    { label: 'Report ID', value: complaint.reportId },
    { label: 'Station', value: complaint.station },
    { label: 'Police Force', value: complaint.force },
    {
      label: 'Date of Complaint',
      value: formatDate(complaint.dateOfComplaint!)
    },
    {
      label: 'Date of Addressal',
      value: formatDate(complaint.dateOfAddressal!)
    },
    {
      label: 'Date of Resolution',
      value: formatDate(complaint.dateOfResolution!)
    },
    { label: 'Incident Type', value: complaint.incidentType },
    { label: 'Incident Description', value: complaint.incidentDescription },
    { label: 'Status', value: complaint.status },
    { label: 'City', value: complaint.city },
    { label: 'County', value: complaint.county },
    { label: 'Latitude', value: complaint.latitude },
    { label: 'Longitude', value: complaint.longitude },
    {
      label: 'Complainant Age',
      value: `${complaint.complainantAge} years old`
    },
    { label: 'Complainant Race', value: complaint.complainantRace },
    { label: 'Complainant Sex', value: SexLookup[complaint.complainantSex!] },
    { label: 'Officer ID', value: complaint.officerId },
    { label: 'Officer Age', value: `${complaint.officerAge} years old` },
    { label: 'Officer Race', value: complaint.officerRace },
    { label: 'Officer Sex', value: SexLookup[complaint.officerSex!] },
    { label: 'Notes', value: complaint.notes }
  ];
  return (
    <div className={'map-metrics-content--complaint'}>
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
 * The content of the complaint information metric tab.
 */
function MetricStationProfile({ complaint, scores }: MetricComplaintInfoProps) {
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

interface MetricTabsProps {
  tabHook: [string, React.Dispatch<SetStateAction<string>>];
}

interface MapMetricsProps {
  complaint: Complaint;
  scores: StationScores;
}

interface MetricStationProfileProps {
  complaint: Complaint;
}

type MetricComplaintInfoProps = MapMetricsProps;

interface ComplaintField {
  label: string;
  value: ReactNode;
}
