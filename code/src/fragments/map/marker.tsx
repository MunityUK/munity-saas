import classnames from 'classnames';
import L, { LatLng, Point } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { SetStateAction } from 'react';
import { Marker } from 'react-leaflet';

import { Complaint } from 'types';

const DEFAULT_ICON = L.icon({
  iconUrl: '/marker.svg',
  iconSize: new Point(21, 36),
  className: 'map-marker'
});

const SELECTED_ICON = L.icon({
  iconUrl: '/marker-selected.svg',
  iconSize: new Point(21, 36),
  className: classnames('map-marker', 'map-marker--selected')
});

/**
 * A marker on the map.
 */
function IMapMarker({
  complaint,
  isSelected,
  setSelectedComplaint
}: MapMarkerProps) {
  const position = new LatLng(complaint.latitude!, complaint.longitude!);
  const icon = isSelected ? SELECTED_ICON : DEFAULT_ICON;
  return (
    <Marker
      position={position}
      icon={icon}
      riseOnHover={true}
      title={complaint.reportId}
      eventHandlers={{
        click: () => setSelectedComplaint(complaint)
      }}>
      {/* <Popup closeButton={false}>
        {complaint.reportId} • {complaint.incidentType}
        <br />
        {complaint.station}
      </Popup> */}
    </Marker>
  );
}

const MapMarker = React.memo(IMapMarker);
export default MapMarker;

type MapMarkerProps = {
  complaint: Complaint;
  isSelected: boolean;
  setSelectedComplaint: React.Dispatch<SetStateAction<Complaint | undefined>>;
};
