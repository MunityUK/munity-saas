import { LatLng } from 'leaflet';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvent } from 'react-leaflet';
import { useDispatch } from 'react-redux';

import { MAP_ATTRIBUTION, MAP_URL } from 'src/utils/constants';
import { setMapZoom, useAppSelector } from 'src/utils/reducers';
import { Complaint, StationScores } from 'types';
import { calculateStationScores } from 'utils/functions';

import MapMarker from './marker';
import MapMetrics from './metrics';

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
      <MapMetrics complaint={selectedComplaint!} scores={scoresByStation!} />
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

type VoiceraMapProps = {
  complaints: Array<Complaint>;
};
