import { useEffect, useRef } from 'react';
import { useMap, useMapEvents, Marker, Popup } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import L from 'leaflet';
import axios from 'axios';

const LocationPicker = ({ position, setPosition, address, setAddress }) => {
    const map = useMap();
    const timeoutRef = useRef(null); // debounce reference

    // --- Reverse geocoding với debounce
    const reverseGeocode = (lat, lng) => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(async () => {
            try {
                const res = await axios.get('https://nominatim.openstreetmap.org/reverse', {
                    params: { lat, lon: lng, format: 'json' },
                    headers: { 'Accept-Language': 'vi' }, // ưu tiên tiếng Việt
                });
                setAddress(res.data.display_name || '');
            } catch (err) {
                console.error('Reverse geocoding error:', err);
            }
        }, 500); // chờ 500ms
    };

    // --- Click trên bản đồ
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            reverseGeocode(lat, lng);
        },
    });

    // --- Draggable marker
    const handleDragEnd = (e) => {
        const { lat, lng } = e.target.getLatLng();
        setPosition([lat, lng]);
        reverseGeocode(lat, lng);
    };

    // --- GeoSearch
    useEffect(() => {
        const provider = new OpenStreetMapProvider();
        const searchControl = new GeoSearchControl({
            provider,
            style: 'bar',
            showMarker: false,
            showPopup: false,
            autoClose: true,
            keepResult: true,
            searchLabel: 'Nhập địa chỉ để tìm...',
        });

        const handleShowLocation = (result) => {
            const { x: lon, y: lat, label } = result.location;
            setPosition([lat, lon]);
            setAddress(label);
            map.setView([lat, lon], 16);
        };

        const handleClear = () => {
            setAddress('');
        };

        map.addControl(searchControl);
        map.on('geosearch/showlocation', handleShowLocation);
        map.on('geosearch/clear', handleClear);

        return () => {
            map.removeControl(searchControl);
            map.off('geosearch/showlocation', handleShowLocation);
            map.off('geosearch/clear', handleClear);
        };
    }, [map, setPosition, setAddress]);

    return (
        <Marker position={position} draggable={true} eventHandlers={{ dragend: handleDragEnd }}>
            {/* <Popup>{position && <span>{setAddress ? setAddress : ''}</span>}</Popup> */}
            <Popup>{address}</Popup>
        </Marker>
    );
};

export default LocationPicker;
