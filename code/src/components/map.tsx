import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { MAP_ATTRIBUTION, MAP_URL } from 'src/utils/constants';
import { useAppSelector } from 'src/utils/reducers';
import { Complaint } from 'types';

const icon = L.icon({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png'
});

export default function VoiceraMap({ complaints }: VoiceraMapProps) {
  const centerPosition = new LatLng(51.45523, -2.59665);
  const { mapZoom } = useAppSelector((state) => state);
  return (
    <div className={'map'}>
      <MapContainer
        center={centerPosition}
        zoom={mapZoom}
        scrollWheelZoom={true}
        className={'map__container'}>
        <TileLayer
          attribution={MAP_ATTRIBUTION}
          url={MAP_URL}
        />
        {complaints.map((complaint, key) => {
          const position = new LatLng(
            complaint.latitude!,
            complaint.longitude!
          );
          return (
            <Marker position={position} icon={icon} key={key}>
              <Popup closeButton={false}>
                {complaint.reportId} • {complaint.incidentType}
                <br />
                {complaint.station}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

type VoiceraMapProps = {
  complaints: Array<Complaint>;
};
