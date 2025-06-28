import { IoClose } from 'react-icons/io5';
import './DailyLogs.css';
import { useState, useRef, useEffect } from 'react';
import AddLogModal from '../modal/addlogmodal/AddLogModal';
import { useAuth } from '../contexts/useAuth';
import axios from 'axios';
import { toast } from 'react-toastify';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${day}-${month}-${year}`;
};

function DailyLogs() {
  const { isAuthenticated } = useAuth();
  const [logs, setLogs] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [pickedDate, setPickedDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddLogModal, setShowAddLogModal] = useState(false);

  const dateInputRef = useRef(null);

  const dateFilterOptions = ['all', 'today', 'yesterday', 'dayBeforeYesterday', 'lastSevenDays', 'pickByDate'];
  const toTitleCase = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());
  const API_BASE = import.meta.env.VITE_API_URL;


  useEffect(() => {
    if (dateFilter === 'pickByDate' && dateInputRef.current) {
      dateInputRef.current.showPicker?.() || dateInputRef.current.click();
    }
  }, [dateFilter]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${API_BASE}/log-api/get-logs`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (response.status === 200) {
          setLogs(response.data.payload);
        }
      } catch (error) {
        toast.error("Error fetching logs");
      }
    };

    if (isAuthenticated) {
      fetchLogs();
    }
  }, [isAuthenticated]);

  const todayStr = formatDate(new Date());
  const yesterdayStr = formatDate(new Date(Date.now() - 86400000));
  const dayBeforeYesterdayStr = formatDate(new Date(Date.now() - 172800000));

  const filteredLogs = logs.filter(log => {
    const logDateStr = formatDate(new Date(log.createdAt));

    switch (dateFilter) {
      case 'all': return true;
      case 'today': return logDateStr === todayStr;
      case 'yesterday': return logDateStr === yesterdayStr;
      case 'dayBeforeYesterday': return logDateStr === dayBeforeYesterdayStr;
      case 'pickByDate': return logDateStr === pickedDate;
      case 'lastSevenDays': {
        const logCreatedDate = new Date(log.createdAt);
        const sevenDaysAgo = new Date(Date.now() - 518400000); // 6 days ago
        return logCreatedDate >= sevenDaysAgo && logCreatedDate <= new Date();
      }
      default: return false;
    }
  });

  const displayedLogs = searchTerm
    ? logs.filter(log =>
      log.workedOn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    : filteredLogs;

  return (
    <div className="logs-container">
      <div className="logs-header">
        <h2 className="comp-heading">Your Logs</h2>
        <button
          className="add-log-btn"
          onClick={() => setShowAddLogModal(!showAddLogModal)}
        >
          + Add log
        </button>
      </div>

      <div className="logs-controls">
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          {dateFilterOptions.map((filterType, index) => (
            <option key={index} value={filterType}>
              {toTitleCase(filterType)}
            </option>
          ))}
        </select>

        <input
          type="date"
          ref={dateInputRef}
          style={{ position: 'absolute', left: '-5000px', top: '0' }}
          value={pickedDate}
          onChange={(e) => setPickedDate(e.target.value)}
        />

        <input
          type='text'
          placeholder='🔍 Search logs by worked on/tags'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
       <p className='warning-note-logs'>
          ⚠️ <strong>Note: </strong> The logs will be automatically deleted after <strong>14 days</strong> of the log creation.
        </p>

      <div className="logs-list">
        {displayedLogs.length === 0 ? (
          <p>No logs found for the current search or date.</p>
        ) : (
          displayedLogs.map((log, index) => (
            <div className='log-entry' key={index}>
              <h3>Log Date: {formatDate(new Date(log.createdAt))}</h3>
              <p><strong>Worked On: </strong>{log.workedOn}</p>
              {log.blockers
                ? <p><strong>Blockers: </strong>{log.blockers}</p>
                : <p>No blockers for this log</p>}
              <p><strong>Notes:</strong> {log.notes}</p>
              {log.links?.length > 0 ? (
                <p>
                  <strong>Links: </strong>
                  {log.links.map((link, i) => (
                    <a key={i} href={link} target="_blank" rel="noopener noreferrer">
                      {link}{i < log.links.length - 1 ? ', ' : ''}
                    </a>
                  ))}
                </p>
              ) : <p>No Links to display for this log</p>}
            </div>
          ))
        )}
      </div>

      {showAddLogModal && (
        <div className='modal-overlay' onClick={() => setShowAddLogModal(!showAddLogModal)}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <button className='close-btn' onClick={() => setShowAddLogModal(false)}><IoClose /></button>
            <AddLogModal formatDate={formatDate} />
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyLogs;
