import './Welcome.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Login from '../login/Login';
import { IoClose } from "react-icons/io5";
function Welcome() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className='welcome-container'>
      <h1>DevHub</h1>
      <h3 className='app-description'>Your App for your developers</h3>
      <div className='wel-redirect-links'>
        <button className='wel-redirect-link' onClick={() => setShowLoginModal(true)}>Login</button>
        <button className='wel-redirect-link'><Link to='/register'>Register</Link></button>
      </div>

      {showLoginModal && (
        <div className='modal-overlay' onClick={() => setShowLoginModal(false)}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <button className='close-btn' onClick={() => setShowLoginModal(false)}><IoClose/></button>
            <Login />
          </div>
        </div>
      )}
    </div>
  );
}

export default Welcome;