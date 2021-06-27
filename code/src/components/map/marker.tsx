import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { SetStateAction } from 'react';
import { Marker, Popup } from 'react-leaflet';

import { Complaint } from 'types';

const ICON = L.icon({
  iconUrl: '/marker.svg',
  shadowUrl: '/marker-shadow.png',
  className: 'map-marker'
});

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

const MapMarker = React.memo(IMapMarker);
export default MapMarker;

type MapMarkerProps = {
  complaint: Complaint;
  setSelectedComplaint: React.Dispatch<SetStateAction<Complaint | undefined>>;
};
