import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

function Routing({ waypoints, setRouteCoords }) {
    const map = useMap(); // lấy map từ MapContainer

    useEffect(() => {
        if (!map || waypoints.length < 2) return;

        const routingControl = L.Routing.control({
            waypoints: waypoints.map((p) => L.latLng(p.lat, p.lng)), // thêm waypoints các trạm và điểm đầu cuối
            routeWhileDragging: false,
            showAlternatives: false,
            addWaypoints: false,
            draggableWaypoints: false,
            router: new L.Routing.OSRMv1({
                serviceUrl: 'http://localhost:5001/route/v1',
            }),
        })
            .on('routesfound', function (e) {
                const coords = e.routes[0].coordinates; // trả về khi tìm thấy routesfound, e.routes[0] là đường ngắn nhất .coordinates là list tọa
                // setRouteCoords(coords);
            })
            .addTo(map); // add đường vẽ vào

        // cleanup an toàn hơn
        return () => {
            if (routingControl) {
                try {
                    routingControl.getPlan().setWaypoints([]); // xoá waypoints
                    map.removeControl(routingControl); // gỡ control
                } catch (err) {
                    console.warn('Routing cleanup error:', err.message);
                }
            }
        };
    }, []);

    return null;
}

export default Routing;
