import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { MAP_ATTRIBUTION, MAP_URL } from 'src/utils/constants';
import { useAppSelector } from 'src/utils/reducers';
import { Complaint } from 'types';

const ICON = L.icon({
  iconUrl: '/marker.svg',
  className: 'map-marker'
});

const CENTER_POSITION = new LatLng(51.45523, -2.59665);

export default function VoiceraMap(props: VoiceraMapProps) {
  const { complaints } = props;
  const { mapZoom } = useAppSelector((state) => state);
  return (
    <div className={'map-container-wrapper'}>
      <MapContainer
        center={CENTER_POSITION}
        zoom={mapZoom}
        scrollWheelZoom={true}
        className={'map-container'}>
        <TileLayer attribution={MAP_ATTRIBUTION} url={MAP_URL} />
        {complaints.map((complaint, key) => {
          return <MapMarker complaint={complaint} key={key} />;
        })}
      </MapContainer>
    </div>
  );
}

function IMapMarker({ complaint }: MapMarkerProps) {
  const position = new LatLng(complaint.latitude!, complaint.longitude!);
  return (
    <Marker position={position} icon={ICON} riseOnHover={true}>
      <Popup closeButton={false}>
        {complaint.reportId} • {complaint.incidentType}
        <br />
        {complaint.station}
      </Popup>
    </Marker>
  );
}

const MapMarker = React.memo(IMapMarker);

type VoiceraMapProps = {
  /** The list of complaints to populate the map with. */
  complaints: Array<Complaint>;
};

type MapMarkerProps = {
  /** The complaint to mark on the map. */
  complaint: Complaint;
};
