import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function ShowMap() {
    return (<MapContainer center={[21.0285, 105.8542]} zoom={13} style={{ height: '500px', width: '500px' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />
            </MapContainer>  );
}

export default ShowMap;