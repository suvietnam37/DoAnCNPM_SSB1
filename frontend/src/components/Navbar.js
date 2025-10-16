// D:\Project_CNPM\DoAnCNPM_SSB1\frontend\src\components\Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Đăng nhập</Link></li>
        <li><Link to="/routes">Quản lý Tuyến</Link></li>
        <li><Link to="/dashboard">Dashboard Admin</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;