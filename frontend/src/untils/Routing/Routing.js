// import { useEffect } from 'react';
// import { useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet-routing-machine';

// function Routing({ waypoints, setRouteCoords, setC = false }) {
//     const map = useMap(); // lấy map từ MapContainer

//     useEffect(() => {
//         if (!map || waypoints.length < 1) return;

//         const routingControl = L.Routing.control({
//             waypoints: waypoints.map((p) => L.latLng(p.lat, p.lng)), // thêm waypoints các trạm và điểm đầu cuối
//             routeWhileDragging: false,
//             showAlternatives: false,
//             addWaypoints: false,
//             draggableWaypoints: false,
//             router: new L.Routing.OSRMv1({
//                 serviceUrl: 'http://localhost:5001/route/v1',
//             }),
//         })
//             .on('routesfound', function (e) {
//                 const coords = e.routes[0].coordinates; // trả về khi tìm thấy routesfound, e.routes[0] là đường ngắn nhất .coordinates là list tọa
//                 if (setC) setRouteCoords(coords);
//             })
//             .addTo(map); // add đường vẽ vào

//         // cleanup an toàn hơn
//         return () => {
//             if (routingControl) {
//                 try {
//                     routingControl.getPlan().setWaypoints([]); // xoá waypoints
//                     map.removeControl(routingControl); // gỡ control
//                 } catch (err) {
//                     console.warn('Routing cleanup error:', err.message);
//                 }
//             }
//         };
//     }, [map, waypoints]);

//     return null;
// }

// export default Routing;
import { useEffect } from 'react';
import { useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

function Routing({ waypoints, setRouteCoords, setC = false }) {
    const map = useMap();
    const API_KEY = 'c60f651a0cb34583b37b7afd50b13e18';

    useEffect(() => {
        if (!map || waypoints.length < 2) return;

        let polylineLayer;
        let markerLayers = [];

        const fetchRoute = async () => {
            try {
                // Tạo chuỗi waypoints cho Geoapify
                const coordsString = waypoints.map((p) => `${p.lat},${p.lng}`).join('|');
                const url = `https://api.geoapify.com/v1/routing?waypoints=${coordsString}&mode=drive&apiKey=${API_KEY}`;
                const res = await fetch(url);
                const data = await res.json();

                if (!data.features || data.features.length === 0) {
                    console.warn('No route returned from Geoapify');
                    return;
                }

                // // Geoapify có thể trả nhiều segment nếu nhiều waypoint
                // const segments = data.features[0].geometry.coordinates.map((segment) =>
                //     segment.map(([lng, lat]) => ({ lat, lng })),
                // );

                // // Nối các segment thành 1 mảng duy nhất, bỏ trùng điểm đầu
                // let fullRoute = [];
                // segments.forEach((segment, index) => {
                //     if (index > 0) segment.shift(); // bo cac diem dau cac moc giua
                //     fullRoute = fullRoute.concat(segment); // ham noi mang
                // });

                let fullRoute = [];

                const geometry = data.features[0].geometry;

                // {
                // "geometry": {
                //     "type": "LineString" // "MuntipleString",
                //     "coordinates": [
                //     [106.1234, 10.1234],
                //     [106.2345, 10.2345]
                //     ]
                // }
                // }

                // Geoapify trả LineString
                if (geometry.type === 'LineString') {
                    fullRoute = geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
                }

                // Geoapify trả MultiLineString
                else if (geometry.type === 'MultiLineString') {
                    geometry.coordinates.forEach((segment, index) => {
                        let pts = segment.map(([lng, lat]) => ({ lat, lng }));
                        if (index > 0) pts.shift();
                        fullRoute = fullRoute.concat(pts);
                    });
                }

                // Gửi lên parent
                if (setC) setRouteCoords(fullRoute);

                // Vẽ polyline
                const leafletCoords = fullRoute.map((p) => [p.lat, p.lng]);
                polylineLayer = L.polyline(leafletCoords, {
                    color: '#0074D9', // màu xanh đẹp
                    weight: 3,
                    opacity: 0.8,
                    lineJoin: 'round',
                }).addTo(map);

                // Fit bounds an toàn
                const bounds = polylineLayer.getBounds();
                if (bounds.isValid()) map.fitBounds(bounds, { padding: [50, 50] });

                // Tạo marker cho mỗi waypoint
                waypoints.forEach((p, i) => {
                    const marker = L.marker([p.lat, p.lng], {
                        icon: L.icon({
                            iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                            iconSize: [30, 30],
                            iconAnchor: [15, 30],
                        }),
                    })
                        .addTo(map)
                        .bindPopup(`Waypoint ${i + 1}`);
                    markerLayers.push(marker);
                });
            } catch (err) {
                console.error('Routing error:', err);
            }
        };

        fetchRoute();

        // Cleanup khi unmount hoặc waypoints thay đổi
        return () => {
            if (polylineLayer) map.removeLayer(polylineLayer);
            markerLayers.forEach((marker) => map.removeLayer(marker));
        };
    }, [map, waypoints]);

    return null;
}

export default Routing;
