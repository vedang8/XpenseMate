import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/index';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
