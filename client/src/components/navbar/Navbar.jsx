import './Navbar.css';
import DevHubLogo from '../../assets/images/logo.png';
import { useEffect, useRef, useState } from 'react';
import { MdArrowDropDown, MdLogout } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { jwtDecode } from 'jwt-decode';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const { logout } = useAuth();

  const [dateTime, setDateTime] = useState(new Date());
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); // { id, username, iat, exp }
        setUsername(decoded.username);
        setUserId(decoded.id);
      } catch (err) {
        console.error('Invalid token:', err.message);
      }
    }
  }, []);

  // closes the dropdown when user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update the date, time every second
  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // format the date, time
  const formattedDateTime = dateTime.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) + ' at ' + dateTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata'
  });


  const handleLogout = () => {
    logout();
  }

  return (
    <nav className='navbar'>
      <div className='navbar-left'>
        <img src={DevHubLogo} width="140" alt='DevHub Logo' />
        <div className='user-info'>
          <h1 className='navbar-title'>Hey {username ? username : 'Developer'}! </h1>
          <span className='user-id'>ID: {userId}</span>
        </div>
        
      </div>

      <div className='navbar-cemter'>
        <span className='date-time'>{formattedDateTime}</span>
      </div>

      <div className='dropdown' ref={dropdownRef}>
        <button
          className='dropdown-toggle'
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          Menu <MdArrowDropDown />
        </button>

        {dropdownOpen && (
          <ul className='dropdown-menu'>
            <li><Link to="snippets">Snippets</Link></li>
            <li><Link to="logs">Daily Logs</Link></li>
            <li><Link to="learnings">Learnings</Link></li>
            <li><Link to="bookmarks">Bookmarks</Link></li>
            <li><Link to="tools">Tools</Link></li>
            <li>
              <button className="dropdown-logout" onClick={handleLogout}>
                <MdLogout style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
