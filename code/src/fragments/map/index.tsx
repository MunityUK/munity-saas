import { LatLng } from 'leaflet';
import React, { SetStateAction, useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { useDispatch } from 'react-redux';

import { setMapZoom, useAppSelector } from 'src/reducers/app';
import { Complaint, StationScores } from 'types';
import { MAP_ATTRIBUTION, MAP_URL } from 'utils/constants';

import MapMarker from './marker';
import MapMetrics from './metrics';

const CENTER_POSITION = new LatLng(51.45523, -2.59665);

export default function MunityMap({ complaints }: MunityMapProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint>();
  const [scoresByStation, setScoresByStation] = useState<StationScores>();

  useEffect(() => {
    const scores = Complaint.calculateStationScores(complaints);
    setScoresByStation(scores);
  }, []);

  return (
    <div className={'map-container-wrapper'}>
      <MapLayout
        complaints={complaints}
        selectedComplaintHook={[selectedComplaint, setSelectedComplaint]}
      />
      <MapMetrics complaint={selectedComplaint!} scores={scoresByStation!} />
    </div>
  );
}

/**
 * The Leaflet map interface.
 */
function MapLayout({ complaints, selectedComplaintHook }: MapLayoutProps) {
  const { mapZoom } = useAppSelector((state) => state);
  const [selectedComplaint, setSelectedComplaint] = selectedComplaintHook;
  return (
    <MapContainer
      center={CENTER_POSITION}
      zoom={mapZoom}
      scrollWheelZoom={true}
      className={'map-container'}>
      <MapAssist setSelectedComplaint={setSelectedComplaint} />
      {complaints.map((complaint, key) => {
        return (
          <MapMarker
            complaint={complaint}
            setSelectedComplaint={setSelectedComplaint}
            isSelected={selectedComplaint?.id === complaint.id}
            key={key}
          />
        );
      })}
    </MapContainer>
  );
}

/**
 * Handles map events and displays attribution.
 */
function MapAssist({ setSelectedComplaint }: MapAssistProps) {
  const dispatch = useDispatch();

  const map = useMapEvents({
    // Reset selected complaint on map click.
    click: () => {
      setSelectedComplaint(undefined);
    },
    // Save the new zoom value on each zoom.
    zoomend: () => {
      const zoomValue = map.getZoom();
      dispatch(setMapZoom(zoomValue));
    }
  });

  return <TileLayer attribution={MAP_ATTRIBUTION} url={MAP_URL} />;
}

type MunityMapProps = {
  complaints: Array<Complaint>;
};

type MapAssistProps = {
  setSelectedComplaint: React.Dispatch<SetStateAction<Complaint | undefined>>;
};

type MapLayoutProps = {
  complaints: Array<Complaint>;
  selectedComplaintHook: [
    Complaint | undefined,
    React.Dispatch<SetStateAction<Complaint | undefined>>
  ];
};
