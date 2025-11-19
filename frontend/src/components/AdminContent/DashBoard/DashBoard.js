import styles from './DashBoard.module.scss';
import classNames from 'classnames/bind';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from '../../../untils/CustomAxios/axios.customize';

import { useState, useEffect, useContext, useRef } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from '../../../context/auth.context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Routing from '../../../untils/Routing/Routing';

const cx = classNames.bind(styles);

// const busIcon = L.icon({
//     iconUrl: '/bus.png', // đường dẫn ảnh
//     iconSize: [35, 35], // kích thước icon
// });

// const busNumberIcon = (number) =>
//     L.divIcon({
//         className: 'bus-custom-icon',
//         html: `
//       <div style="
//         position: relative;
//         width: 35px;
//         height: 35px;
//       ">
//         <img
//           src="/bus.png"
//           style="width:35px;height:35px;display:block;"
//         />
//         <div style="
//           position:absolute;
//           top:-15px;
//           left:6px;
//           width:22px;
//           height:22px;
//           display:flex;
//           justify-content:center;
//           align-items:center;
//           font-size:16px;
//           font-weight:600;
//           color:white;
//           border: 1px solid  ;
//           border-radius: 99px;
//           background-color: black;

//         ">
//           ${number}
//         </div>
//       </div>
//     `,
//         iconSize: [35, 35],
//         iconAnchor: [17, 35],
//         popupAnchor: [0, -40],
//     });

const busNumberIcon = (number) =>
    L.divIcon({
        className: 'bus-custom-icon',
        html: `
      <div class="bus-icon-wrapper">
        <img 
          src="/bus.png" 
          style="width:35px;height:35px;display:block;"
        />
        <div class="bus-number-circle">
          ${number}
        </div>
      </div>
    `,
        iconSize: [35, 35],
        iconAnchor: [17, 35],
        popupAnchor: [0, -40],
    });

function DashBoard() {
    const authContext = useContext(AuthContext);
    const ACCOUNT_ID = authContext.auth.user.account_id;
    const date = new Date().toISOString().split('T')[0];
    const [waypoints, setWaypoints] = useState([]);
    const [noti, setNoti] = useState([]);
    const [numStudents, setNumStudents] = useState([]);
    const [numDrivers, setNumDrivers] = useState([]);
    const [numBuses, setNumBuses] = useState([]);
    const [numRoutes, setNumRoutes] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [runningAssignment, setRunningAssignment] = useState([]);
    const socketRef = useRef(null);
    const listRef = useRef(null);

    const [focus, setFocus] = useState(false);
    const [routing, setRouting] = useState(false);
    const [routingBus, setRoutingBus] = useState(null);

    const handleRoutingBus = (route_id) => {
        if (routingBus === route_id) {
            setRouting(false);
            setRoutingBus(null);
        } else {
            setRouting(true);
            setRoutingBus(route_id);
        }
    };

    useEffect(() => {
        socketRef.current = io('http://localhost:5000');

        socketRef.current.on('report', (message) => {
            setNoti((prev) => [...prev, message]);
        });

        return () => {
            socketRef.current.off('report');
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        const handleStartRoute = (data) => {
            fetchRouteAssignments();
        };

        socketRef.current.on('startRoute', handleStartRoute);

        const handleGetLocation = (data) => {
            setRunningAssignment((prev) =>
                prev.map((a) => (a.route_id === data.route_id ? { ...a, currentLocation: data.location } : a)),
            );
        };
        socketRef.current.on('location', handleGetLocation);

        const handleGetWaypoints = (data) => {
            setWaypoints((prev) => {
                const e = prev.findIndex((w) => w.route_id === data.route_id);
                if (e === -1) {
                    // chua co them moi
                    return [...prev, data];
                }
                return prev;
            });
        };

        socketRef.current.on('waypoints', handleGetWaypoints);

        return () => {
            socketRef.current.off('startRoute', handleStartRoute);
            socketRef.current.off('location', handleGetLocation);
            socketRef.current.off('waypoints', handleGetWaypoints);
        };
    }, []);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTo({
                top: listRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [noti]);

    // Lấy dữ liệu từ API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsResp, driversResp, busesResp, routesResp, notisResp] = await Promise.all([
                    axios.get('http://localhost:5000/api/students'),
                    axios.get('http://localhost:5000/api/drivers'),
                    axios.get('http://localhost:5000/api/buses'),
                    axios.get('http://localhost:5000/api/routes'),
                    axios.get(`http://localhost:5000/api/notifications?account_id=${ACCOUNT_ID}&date=${date}`),
                ]);
                setNumStudents(studentsResp.data);
                setNumDrivers(driversResp.data);
                setNumBuses(busesResp.data);
                setNumRoutes(routesResp.data);
                setNoti(notisResp.data.map((item) => item.content));
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
        fetchData();
        fetchRouteAssignments();
    }, []);

    const fetchRouteAssignments = async () => {
        try {
            const assignRes = await axios.get('http://localhost:5000/api/route_assignments');
            setAssignments(assignRes.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        const runAssignments = assignments.filter((a) => a.status === 'Running');
        if (runAssignments) setRunningAssignment(runAssignments);
    }, [assignments]);

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>Tổng quan hệ thống</h2>
            <div className={cx('stats')}>
                <div className={cx('card')}>Tuyến xe: {numRoutes.length}</div>
                <div className={cx('card')}>Xe bus: {numBuses.length}</div>
                <div className={cx('card')}>Tài xế: {numDrivers.length}</div>
                <div className={cx('card')}>Học sinh: {numStudents.length}</div>
            </div>
            <div className={cx('content')}>
                <div className={cx('content-map')}>
                    <MapContainer
                        center={[10.7597031, 106.6817595]}
                        zoom={12}
                        style={{ height: '385px', width: '100%' }}
                    >
                        <TileLayer
                            url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                        />

                        {runningAssignment?.map((i) => {
                            // console.log('i.currentLocation: ', i.currentLocation);
                            return (
                                <Marker
                                    eventHandlers={{
                                        click: () => handleRoutingBus(i.route_id),
                                    }}
                                    key={i.assignment_id}
                                    position={i.currentLocation || [10.7597031, 106.6817595]}
                                    icon={busNumberIcon(i.route_id)}
                                />
                            );
                        })}

                        {routing && routingBus && waypoints && (
                            <Routing waypoints={waypoints.find((w) => w.route_id === routingBus)?.waypoints || []} />
                        )}
                    </MapContainer>
                </div>
                <div></div>
                <div className={cx('content-notification')}>
                    <h1>Thông báo hệ thống</h1>
                    <div className={cx('content-notification-content')}>
                        <ul ref={listRef}>
                            {noti.map((content, index) => (
                                <li key={index}>{content}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashBoard;
