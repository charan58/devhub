import './JwtDecoder.css';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaRegClipboard, FaClipboardCheck } from "react-icons/fa";
function JwtDecoder() {
  const [jwt, setJwt] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleDecode = () => {
    setError('');
    setHeader('');
    setPayload('');

    try {
      if (!jwt.trim()) {
        throw new Error("Please specify a JWT.");
      }
      const parts = jwt.split('.');

      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const decodeHeader = JSON.parse(atob(parts[0]));
      const decodePayload = JSON.parse(atob(parts[1]));

      setHeader(decodeHeader);
      setPayload(decodePayload);
      toast.success('JWT decoded successfully');
    } catch (error) {
      setError('Invalid JWT token');
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    toast.success('Payload copied to clipboard!');
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className='jwt-decoder-container'>

      
      <h2>Decode JWT</h2>
       
      <div className='jwt-header'>

        <div className='jwt-input-field'>

          <textarea
            placeholder='Paste the JWT here'
            value={jwt}
            onChange={(e) => setJwt(e.target.value)}
            rows={7}
          />
          {error && <p className='text-error'>*{error}</p>}
          <div className='actions' >
            <button onClick={handleDecode}>Decode</button>
          </div>
        </div>

        {header && <div className='header-section'>
          <h3>Header</h3>
          <pre>{JSON.stringify(header, null, 2)}</pre>
        </div>
        }

        {payload && <div className='payload-section'>
          <div className="payload-header">
            <h3>Payload</h3>
            <button className="copy-btn" onClick={handleCopy}>
              {copied ? <FaClipboardCheck size={18} /> : <FaRegClipboard size={18} />}
            </button>
          </div>
          <pre>{JSON.stringify(payload, null, 2)}</pre>
        </div>}

      </div>

          {(header || payload) && (
        <p className='warning-note'>
          ⚠️ <strong>Note: </strong>This tool only decodes the token. It does <strong>not verify</strong> the signature. Use only for testing and development.
        </p>
      )}
     

    </div>
  )
}

export default JwtDecoder