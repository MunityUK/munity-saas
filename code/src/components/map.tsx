import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { SetStateAction, useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvent
} from 'react-leaflet';
import { useDispatch } from 'react-redux';

import { MAP_ATTRIBUTION, MAP_URL } from 'src/utils/constants';
import { setMapZoom, useAppSelector } from 'src/utils/reducers';
import { Complaint, ComplaintStatus, StationScores } from 'types';
import { calculateStationScores } from 'utils/functions';

const ICON = L.icon({
  iconUrl: '/marker.svg',
  shadowUrl: '/marker-shadow.png',
  className: 'map-marker'
});

const CENTER_POSITION = new LatLng(51.45523, -2.59665);

export default function VoiceraMap({ complaints }: VoiceraMapProps) {
  const { mapZoom } = useAppSelector((state) => state);

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint>();
  const [scoresByStation, setScoresByStation] = useState<StationScores>();

  useEffect(() => {
    const scores = calculateStationScores(complaints);
    setScoresByStation(scores);
  }, []);

  return (
    <div className={'map-container-wrapper'}>
      <MapContainer
        center={CENTER_POSITION}
        zoom={mapZoom}
        scrollWheelZoom={true}
        className={'map-container'}>
        <MapAssist />
        {complaints.map((complaint, key) => {
          return (
            <MapMarker
              complaint={complaint}
              setSelectedComplaint={setSelectedComplaint}
              key={key}
            />
          );
        })}
      </MapContainer>
      <MapMetrics complaint={selectedComplaint} scores={scoresByStation!} />
    </div>
  );
}

/**
 * Uses access to map object as child to performs map functions.
 */
function MapAssist() {
  const dispatch = useDispatch();

  // Save the new zoom value on each zoom.
  const map = useMapEvent('zoomend', () => {
    const zoomValue = map.getZoom();
    dispatch(setMapZoom(zoomValue));
  });

  return <TileLayer attribution={MAP_ATTRIBUTION} url={MAP_URL} />;
}

/**
 * A marker on the map.
 */
function IMapMarker({ complaint, setSelectedComplaint }: MapMarkerProps) {
  const position = new LatLng(complaint.latitude!, complaint.longitude!);
  return (
    <Marker
      position={position}
      icon={ICON}
      riseOnHover={true}
      eventHandlers={{
        click: () => setSelectedComplaint(complaint)
      }}>
      <Popup closeButton={false}>
        {complaint.reportId} • {complaint.incidentType}
        <br />
        {complaint.station}
      </Popup>
    </Marker>
  );
}

/**
 * The pane showing metrics for a complaint.
 */
function MapMetrics({ complaint, scores }: MapMetricsProps) {
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

  if (!complaint) return null;

  return (
    <div className={'map-metrics'}>
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

const MapMarker = React.memo(IMapMarker);

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

type VoiceraMapProps = {
  complaints: Array<Complaint>;
};

type MapMarkerProps = {
  complaint: Complaint;
  setSelectedComplaint: React.Dispatch<SetStateAction<Complaint | undefined>>;
};

type MapMetricsProps = {
  complaint?: Complaint;
  scores: StationScores;
};
