// src/components/Sidebar/Sidebar.jsx
import React from "react";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <ul>
        <li>Dashboard</li>
        <li>Tài xế</li>
        <li>Phụ huynh</li>
        <li>Cài đặt</li>
      </ul>
    </aside>
  );
}

export default Sidebar;
