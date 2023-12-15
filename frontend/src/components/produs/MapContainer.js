import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
  width: '600px',
  height: '450px',
};

export class MapContainer extends React.Component {
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={{
          lat: 47.764949, // Latitudinea pentru adresa specificată
          lng: 27.914817, // Longitudinea pentru adresa specificată
        }}
      >
        <Marker position={{ lat: 47.764949, lng: 27.914817 }} />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'TU_CHEIE_API_MAPS',
})(MapContainer);
