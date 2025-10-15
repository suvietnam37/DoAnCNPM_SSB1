// src/components/Header/Header.jsx
import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <h1> Bus Tracking System</h1>
      <nav>
        <ul>
          <li>Trang chủ</li>
          <li>Liên hệ</li>
          <li>Đăng xuất</li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
