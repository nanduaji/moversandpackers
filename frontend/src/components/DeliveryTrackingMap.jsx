import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';

const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const getNewCoordinates = (lat, lon, distanceInKm) => {
    const R = 6371;
    const deltaLon = (distanceInKm / R) * (180 / Math.PI);
    const newLat = lat;
    const newLon = lon + deltaLon;
    return [newLat, newLon];
};

const DeliveryTrackingMap = ({ pickUpAddressCoords }) => {
    const pickupCoords = pickUpAddressCoords || [37.7749, -122.4194]; 
    const secondMarkerCoords = getNewCoordinates(pickupCoords[0], pickupCoords[1], 50);
    const trackingPoints = [pickupCoords, secondMarkerCoords];

    return (
        <MapContainer
            center={pickupCoords}
            zoom={6.3}
            style={{ height: '250px', width: '100%', borderRadius: '12px' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={pickupCoords} icon={customIcon}>
                <Popup>Pickup Location</Popup>
            </Marker>

            <Marker position={secondMarkerCoords} icon={customIcon}>
                <Popup>50 km East of Pickup</Popup>
            </Marker>

            <Polyline positions={trackingPoints} color="blue" weight={4} />
        </MapContainer>
    );
};

export default DeliveryTrackingMap;
