// D:\Project_CNPM\DoAnCNPM_SSB1\frontend\src\components\Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [drivers, setDrivers] = useState([]);
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [stats, setStats] = useState({ driversCount: 0, busesCount: 0, routesCount: 0 });
    const [message, setMessage] = useState('');

    // Lấy dữ liệu từ API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [driversResp, busesResp, routesResp] = await Promise.all([
                    axios.get('http://localhost:5000/api/drivers'),
                    axios.get('http://localhost:5000/api/buses'),
                    axios.get('http://localhost:5000/api/routes'),
                ]);
                setDrivers(driversResp.data);
                setBuses(busesResp.data);
                setRoutes(routesResp.data);
                setStats({
                    driversCount: driversResp.data.length,
                    busesCount: busesResp.data.length,
                    routesCount: routesResp.data.length,
                });
            } catch (error) {
                setMessage('Lỗi khi tải dữ liệu dashboard!');
                console.error('Fetch error:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="admin-dashboard">
            <h2>Dashboard Quản Trị Viên</h2>
            {message && <p className="error-message">{message}</p>}

            {/* Thống kê tổng quan */}
            <div className="stats-section">
                <div className="stat-card">
                    <h3>Tài Xế</h3>
                    <p>{stats.driversCount}</p>
                </div>
                <div className="stat-card">
                    <h3>Xe Buýt</h3>
                    <p>{stats.busesCount}</p>
                </div>
                <div className="stat-card">
                    <h3>Tuyến Đường</h3>
                    <p>{stats.routesCount}</p>
                </div>
            </div>

            {/* Danh sách tài xế */}
            <div className="data-section">
                <h3>Danh Sách Tài Xế</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>SĐT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map((driver) => (
                            <tr key={driver.id}>
                                <td>{driver.id}</td>
                                <td>{driver.name}</td>
                                <td>{driver.phone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Danh sách xe buýt */}
            <div className="data-section">
                <h3>Danh Sách Xe Buýt</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Biển Số</th>
                            <th>Tài Xế</th>
                        </tr>
                    </thead>
                    <tbody>
                        {buses.map((bus) => (
                            <tr key={bus.id}>
                                <td>{bus.id}</td>
                                <td>{bus.licensePlate}</td>
                                <td>{bus.driverId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Danh sách tuyến */}
            <div className="data-section">
                <h3>Danh Sách Tuyến Đường</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Điểm Bắt Đầu</th>
                            <th>Điểm Kết Thúc</th>
                            <th>Thời Gian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {routes.map((route) => (
                            <tr key={route.id}>
                                <td>{route.id}</td>
                                <td>{route.start}</td>
                                <td>{route.end}</td>
                                <td>{route.departTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
