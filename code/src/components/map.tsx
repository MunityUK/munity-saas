import React from 'react';
import GoogleMapReact from 'google-map-react';

export default function GoogleMap() {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyBOgkiy5T3TRckxzgwIi-xdgfObu3kJWgE' }}
        defaultCenter={{
          lat: 59.95,
          lng: 30.33
        }}
        defaultZoom={11}>
        <GoogleMapMarker lat={59.955413} lng={30.337844} text={'My Marker'} />
      </GoogleMapReact>
    </div>
  );
}

const GoogleMapMarker = ({ text }: GoogleMapMarkerProps) => <div>{text}</div>;

type GoogleMapMarkerProps = {
  lat: number;
  lng: number;
  text: string;
};
