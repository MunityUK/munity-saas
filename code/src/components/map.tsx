import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import Complaint from 'src/classes';
import { useAppSelector } from 'src/utils/reducers';

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
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
