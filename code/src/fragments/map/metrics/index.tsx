import classnames from 'classnames';
import React, { SetStateAction, useState } from 'react';

import { Complaint, StationScores } from 'types';

import MetricComplaintInfo from './complaint';
import MetricStationProfile from './station';

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

  const classes = classnames('map-metrics', {
    'map-metrics--visible': !!complaint
  });

  return (
    <dialog className={classes}>
      <MetricTabs tabHook={[selectedTab, setSelectedTab]} />
      <main className={'map-metrics-content'}>
        {selectedTab === 'complaint' ? (
          <MetricComplaintInfo complaint={complaint} />
        ) : (
          <MetricStationProfile station={complaint?.station} scores={scores} />
        )}
      </main>
    </dialog>
  );
}

/**
 * The tabs for switching between map metric content.
 */
function MetricTabs({ tabHook }: MetricTabsProps) {
  const [selectedTab, setSelectedTab] = tabHook;
  return (
    <nav className={'map-metrics-tabs'}>
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
    </nav>
  );
}

interface MapMetricsProps {
  complaint: Complaint;
  scores: StationScores;
}

interface MetricTabsProps {
  tabHook: [string, React.Dispatch<SetStateAction<string>>];
}
