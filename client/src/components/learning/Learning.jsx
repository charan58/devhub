import './Learning.css';
import { useState, useEffect } from "react";
import { FiTrash2 } from 'react-icons/fi';
import AddLearningModal from "../modal/addlearningmodal/AddLearningModal";
import { IoClose } from 'react-icons/io5';
import { useAuth } from '../contexts/useAuth.js';
import axios from 'axios';
import { toast } from 'react-toastify';

function Learning() {
  const [learnings, setLearnings] = useState([]);
  const [showAddLearningModal, setShowAddLearningModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchLearnings = async () => {
      try {
        const response = await axios.get('http://localhost:4000/learning-api/get-learnings', {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        if (response.status === 200) {
          setLearnings(response.data.payload);
        }
      } catch (error) {

      }
    }

    if (isAuthenticated) {
      fetchLearnings();
    }
  }, [isAuthenticated]);

  const handleDeleteLearning = async (learningId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/learning-api/delete-learning/${learningId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })

      if (response.status === 200) {
        toast.info(response.data.message);
        setLearnings(prev => prev.filter(l => l.learningId !== learningId));
      }

    } catch (error) {
      toast.error("Failed to delete the learning");
    }
  }

  const filterLearnings = () => {
    return learnings.filter(learning => learning.topic.toLowerCase().includes(searchTerm.toLowerCase()));
  }


  return (
    <div className="learnings-container">
      {learnings.length === 0 ? <><p>You have no learnings as of now</p> <div className='btn-2'><button
        className="add-learning-btn"
        onClick={() => setShowAddLearningModal(!showAddLearningModal)}
      >
        + Add learning
      </button></div></> : <>
        <div className="learnings-header">
          <h2 className='comp-heading'>Your Learnings</h2>
          <button
            className="add-learning-btn"
            onClick={() => setShowAddLearningModal(!showAddLearningModal)}
          >
            + Add learning
          </button>
        </div>

        <div className="learnings-controls">
          <input
            type="text"
            placeholder="🔍 Search learnings by topic"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="learnings-list">
          {
            filterLearnings().map((learning, index) => (
              <div className='learnings-card' key={index}>
                <h3 className='learnings-topic'>{learning.topic}</h3>
                <h4>Resources:</h4>
                <ul className='resource-list'>
                  {learning.resourceLinks.map((url, i) =>
                    <li key={i} className='resource-item'>
                      <a href={url} target="_blank" rel="noopener noreferrer" className='resource-link'>
                        <strong>{url}</strong>
                      </a>
                    </li>
                  )}
                </ul>

                {/* delete button */}

                <div className='learning-actions'>
                  <button
                    className='learning-delete-btn'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLearning(learning.learningId);
                    }}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>

            ))
          }
        </div>



      </>}

      {showAddLearningModal && (
        <div className='modal-overlay' onClick={() => setShowAddLearningModal(!showAddLearningModal)}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <button className='close-btn' onClick={() => setShowAddLearningModal(false)}><IoClose /></button>
            <AddLearningModal />
          </div>
        </div>
      )}
    </div>
  )
}

export default Learning