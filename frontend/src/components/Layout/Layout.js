// src/components/Layout/Layout.js
import React from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
