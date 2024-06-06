// src/Sidebar.js
import React, {useState, useEffect} from 'react';
import { FaUserCircle, FaTachometerAlt, FaWallet, FaFileExport, FaSignOutAlt, FaHistory } from 'react-icons/fa';
import { NavLink , useNavigate} from 'react-router-dom';
import './Sidebar.css';
import { message } from 'antd';

const Sidebar = () => {
  const [username, setUsername] = useState();
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5013/api/User/logout',{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${token}`,
        }
      });
      if (response.ok) {
        message.success("User logged out successfully")
        localStorage.removeItem('token');
        navigate("/login");
      } else {
        console.error('Failed to fetch username');
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5013/api/User/username', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
        } else {
          console.error('Failed to fetch username');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, []);
  
  return (
    <div className="sidebar">
      <div className="title">
        <h2><span>Xpense</span><span className="highlight">Mate</span></h2>
      </div>
      <div className="user-profile">
        <FaUserCircle size={70} />
        <h3>{username}</h3>
      </div>
      <div className="menu">
        <h3>
        <NavLink to="/home" className="menu-item" activeClassName="active">
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/expense" className="menu-item" activeClassName="active">
          <FaWallet />
          <span>Expenses</span>
        </NavLink>
        <NavLink to="/history" className="menu-item" activeClassName="active">
          <FaHistory />
          <span>History</span>
        </NavLink>
        <NavLink to="/export" className="menu-item" activeClassName="active">
          <FaFileExport />
          <span>Export</span>
        </NavLink>
        </h3>
        <div className="menu-item" activeClassName="active" onClick={logout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
