import React from 'react'
import { useNavigate } from 'react-router-dom'

const Topbar = ({ resetAppState }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // First reset all app state
    if (resetAppState) {
      resetAppState();
    }
    // Then navigate to homepage
    navigate('/');
  };

  return (
    <div className="topbar">
      <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        TravelApp
      </div>
      <div className="profile">
        <div className="avatar"></div>
        <span>User Profile</span>
      </div>
    </div>
  )
}

export default Topbar