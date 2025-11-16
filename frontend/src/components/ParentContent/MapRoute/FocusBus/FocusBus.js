import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
function FocusBus({ busLocation }) {
    const map = useMap();

    useEffect(() => {
        if (busLocation) {
            // map.flyTo([busLocation.lat, busLocation.lng], 16, { duration: 1.5 });
            map.setView([busLocation.lat, busLocation.lng]); // focus
        }
    }, [busLocation, map]);

    return null;
}
export default FocusBus;
