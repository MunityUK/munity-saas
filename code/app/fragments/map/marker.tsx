import { Complaint } from '@munity/utils';
import classnames from 'classnames';
import L, { LatLng, Point } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { SetStateAction } from 'react';
import { Marker } from 'react-leaflet';

const DEFAULT_ICON = L.icon({
  iconUrl: '/widgets/marker.svg',
  iconSize: new Point(21, 36),
  className: 'map-marker'
});

const SELECTED_ICON = L.icon({
  iconUrl: '/widgets/marker-selected.svg',
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
      title={complaint.complaintId}
      eventHandlers={{
        click: () => setSelectedComplaint(complaint)
      }}
    />
  );
}

const MapMarker = React.memo(IMapMarker);
export default MapMarker;

type MapMarkerProps = {
  complaint: Complaint;
  isSelected: boolean;
  setSelectedComplaint: React.Dispatch<SetStateAction<Complaint | undefined>>;
};
