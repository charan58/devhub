import { NavLink, Outlet } from "react-router-dom";
import './Tools.css';

function Tools() {
  const tabs = [
    { path: 'json-formatter', label: 'JSON Formatter' },
    { path: 'jwt-decoder', label: 'JWT Decoder' },
    { path: 'regex-tester', label: 'Regex Tester'},
     { path: 'cron-tester', label: 'Cron Tester' },
  ];

  return (
    <div className="tools-container">
      
      <div className="tabs">
        {tabs.map(tab => (
          <NavLink 
            key={tab.path}
            to={tab.path}
            className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
      
      <div className="tab-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Tools;
