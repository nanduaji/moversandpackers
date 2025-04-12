import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';

// Optional: custom marker icon
const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Function to calculate a new point 50km east of the original coordinates
const getNewCoordinates = (lat, lon, distanceInKm) => {
    const R = 6371; // Radius of Earth in kilometers
    const deltaLon = (distanceInKm / R) * (180 / Math.PI); // Change in longitude for a fixed distance

    // The new coordinates are 50 km east of the original coordinates
    const newLat = lat;
    const newLon = lon + deltaLon;

    return [newLat, newLon];
};

const DeliveryTrackingMap = ({ pickUpAddressCoords }) => {
    // Fallback in case coords are undefined
    const pickupCoords = pickUpAddressCoords || [37.7749, -122.4194]; // fallback to SF

    // Calculate a new point 50 km east of the pickup address
    const secondMarkerCoords = getNewCoordinates(pickupCoords[0], pickupCoords[1], 50); // 50km east

    // Tracking route with pickupCoords and the 50km marker
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

            {/* Dynamic Pickup Marker */}
            <Marker position={pickupCoords} icon={customIcon}>
                <Popup>Pickup Location</Popup>
            </Marker>

            {/* New Marker 50km East of Pickup */}
            <Marker position={secondMarkerCoords} icon={customIcon}>
                <Popup>50 km East of Pickup</Popup>
            </Marker>

            {/* Polyline for Route */}
            <Polyline positions={trackingPoints} color="blue" weight={4} />
        </MapContainer>
    );
};

export default DeliveryTrackingMap;
