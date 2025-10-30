// LocationPicker.js
import React, { useEffect } from 'react';
import { Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

// Marker icon mặc định
const markerIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function GeoSearchBox({ setPosition, setAddress }) {
    const map = useMap();

    useEffect(() => {
        const provider = new OpenStreetMapProvider({
            params: { 'accept-language': 'vi' },
        });

        const searchControl = new GeoSearchControl({
            provider,
            style: 'bar',
            showMarker: true,
            marker: { icon: markerIcon },
            autoClose: true,
            retainZoomLevel: false,
            animateZoom: true,
            searchLabel: 'Tìm kiếm địa chỉ...',
            keepResult: true,
        });

        map.addControl(searchControl);

        const handleShowLocation = (result) => {
            const { x: lng, y: lat, label } = result.location;
            setPosition([lat, lng]);
            setAddress(label);
            map.setView([lat, lng], 16);
        };

        map.on('geosearch/showlocation', handleShowLocation);

        return () => {
            map.removeControl(searchControl);
            map.off('geosearch/showlocation', handleShowLocation);
        };
    }, [map, setPosition, setAddress]);

    return null;
}

function MapClickHandler({ setPosition, setAddress }) {
    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);

            try {
                const res = await axios.get(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=vi`,
                );
                setAddress(res.data.display_name || '');
            } catch (err) {
                console.error('Reverse geocoding error:', err);
                setAddress('');
            }
        },
    });
    return null;
}

export default function LocationPicker({ position, setPosition, address, setAddress }) {
    return (
        <>
            {/* GeoSearch */}
            <GeoSearchBox setPosition={setPosition} setAddress={setAddress} />

            {/* Click chọn vị trí */}
            <MapClickHandler setPosition={setPosition} setAddress={setAddress} />

            {/* Marker */}
            {position && (
                <Marker
                    position={position}
                    icon={markerIcon}
                    draggable
                    eventHandlers={{
                        dragend: async (e) => {
                            const { lat, lng } = e.target.getLatLng();
                            setPosition([lat, lng]);
                            try {
                                const res = await axios.get(
                                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=vi`,
                                );
                                setAddress(res.data.display_name || '');
                            } catch (err) {
                                console.error('Reverse geocoding error:', err);
                                setAddress('');
                            }
                        },
                    }}
                >
                    <Popup>{address || 'Vị trí đã chọn'}</Popup>
                </Marker>
            )}
        </>
    );
}
