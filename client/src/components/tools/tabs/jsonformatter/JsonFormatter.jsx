import { useState } from 'react';
import { toast } from 'react-toastify';
import './JsonFormatter.css'; 

function JsonFormatter() {
  const [rawJson, setRawJson] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [error, setError] = useState('');

  const handleFormat = () => {
    // if user doesn't provide a json
    if (!rawJson.trim()) {
    setFormattedJson('');
    setError('JSON input is empty.');
    toast.error("JSON input is empty.");
    return;
  }

    try {
      const parsed = JSON.parse(rawJson);
      const pretty = JSON.stringify(parsed, null, 2);
      setFormattedJson(pretty);
      setError('');
    } catch (err) {
      setFormattedJson('');
      setError('Invalid JSON: ' + err.message);
      toast.error("Failed to format the JSON.")
    }
  };

  const handleClear = () => {
    setRawJson('');
    setFormattedJson('');
    setError('');
  };

  const handleCopy = () => {

    navigator.clipboard.writeText(formattedJson);
    toast.success("JSON has copied to clipboard.")
  };

  return (
    <div className="json-formatter-container">

    <div className='json-formatter-input'>
      
      <h3>Raw JSON: </h3>
      <textarea
        className="json-input"
        placeholder="Paste your JSON here"
        value={rawJson}
        onChange={(e) => setRawJson(e.target.value)}
        rows={15}
      />

      <div className="actions">
        <button onClick={handleFormat}>Format</button>
        <button onClick={handleClear}>Clear</button>
      </div>


      {error && <p className="text-error">{error}</p>}
    </div>

    <div className='json-formatter-output'>
      {formattedJson && (
        <>
          <h3>Formatted JSON:</h3>
          <textarea
            className="json-output"
            value={formattedJson}
            readOnly
            rows={15}
          />
          <div className='copy-btn-div'>
            <button onClick={handleCopy}>Copy to Clipboard</button>
          </div>
        </>
      )}
      </div>
    </div>
  );
}

export default JsonFormatter;
