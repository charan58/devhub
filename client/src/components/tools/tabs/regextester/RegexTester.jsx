import './RegexTester.css';
import { useState } from 'react';

function RegexTester() {
  const [regexInput, setRegexInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [flags, setFlags] = useState({
    g: true,  // default global flag on
    i: false,
    m: false,
    s: false,
    u: false,
    y: false,
  });
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  // Create flags string from selected checkboxes
  const flagsString = Object.entries(flags)
    .filter(([flag, enabled]) => enabled)
    .map(([flag]) => flag)
    .join('');

  const testRegex = () => {
    if (!regexInput.trim()) {
      setError('Regex pattern cannot be empty.');
      setMatches([]);
      return;
    }

    try {
      const regex = new RegExp(regexInput, flagsString);
      const matchResult = [...textInput.matchAll(regex)];
      setMatches(matchResult);
      setError('');
    } catch (err) {
      setMatches([]);
      setError('Invalid regex: ' + err.message);
    }
  };


  const toggleFlag = (flag) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  return (
    <div className="regex-tester">
      <h2>Regex Tester</h2>

      <div className="regex-body">
        {/* Left: Input Panel */}
        <div className="regex-inputs">
          <input
            type="text"
            placeholder="Enter regex pattern (e.g. \\d+)"
            value={regexInput}
            onChange={(e) => setRegexInput(e.target.value)}
          />

          <div className="flags">
            {[
              { flag: 'g', label: 'Global (g)', desc: 'Find all matches' },
              { flag: 'i', label: 'Ignore Case (i)', desc: 'Case-insensitive matching' },
              { flag: 'm', label: 'Multiline (m)', desc: '^ and $ match line start/end' },
              { flag: 's', label: 'Dot All (s)', desc: 'Dot matches newline' },
              { flag: 'u', label: 'Unicode (u)', desc: 'Unicode mode' },
              { flag: 'y', label: 'Sticky (y)', desc: 'Matches from lastIndex only' },
            ].map(({ flag, label, desc }) => (
              <label key={flag} title={desc} className="flag-label">
                <input
                  type="checkbox"
                  checked={flags[flag]}
                  onChange={() => toggleFlag(flag)}
                />
                <span className="flag-text">{label}</span>
              </label>
            ))}
          </div>

          <textarea
            placeholder="Enter test text here"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />

          <div><button onClick={testRegex} className='test-btn'>Test</button></div>
        </div>

        {/* Right: Output Panel */}
        <div className="regex-results">
          {error && <p className="error">Error: {error}</p>}

          {matches.length > 0 && (
            <div className="matches">
              <h3>Matches:</h3>
              <ul>
                {matches.map((match, idx) => (
                  <li key={idx}>
                    <strong>{match[0]}</strong>
                    {match.length > 1 && (
                      <ul>
                        {match.slice(1).map((group, gIdx) => (
                          <li key={gIdx}>Group {gIdx + 1}: {group}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>

  );
}

export default RegexTester;
