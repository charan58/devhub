import './Snippets.css';
import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import atomOneLight from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-light';
import AddSnippetModal from '../modal/addsnippetmodal/AddSnippetModal';
import UpdateCodeSnippetModal from '../modal/updatecodesnippetmodal/UpdateCodeSnippetModal';
import ConfirmDeletionModal from '../modal/confirmdeletionmodal/ConfirmDeletionModal';
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import { useAuth } from '../contexts/useAuth.js';


SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('mysql', sql);

function Snippets() {
  const [snippets, setSnippets] = useState([]);
  const [search, setSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [showAddSnippetModal, setShowAddSnippetModal] = useState(false);
  const [showUpdateCodeSnippetModal, setShowUpdateCodeSnippetModal] = useState(false);
  const [showConfirmDeletionModal, setShowConfirmDeletionModal] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  const filteredSnippets = snippets.filter(snippet =>
    snippet.title.toLowerCase().includes(search.toLowerCase()) &&
    (languageFilter === '' || snippet.language === languageFilter)
  );

  const API_BASE = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const handleGetUserSnippets = async () => {
      try {
        const response = await axios.get(`${API_BASE}/snippet-api/get-snippets`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.status === 200) {
          setSnippets(response.data.payload);
        }
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        toast.info(error.response?.message);
      }
    };

    if (isAuthenticated) {
      handleGetUserSnippets();
    }
  }, [isAuthenticated]);

  const handleUpdateComplete = (updatedSnippet) => {
    setSnippets(prev =>
      prev.map(snippet =>
        snippet.id === updatedSnippet.id ? updatedSnippet : snippet
      )
    );
    setShowUpdateCodeSnippetModal(false);
    setSelectedSnippet(null);
  };

  const handleDeleteSnippet = async () => {
    try {
      const response = await axios.delete(
        `${API_BASE}/snippet-api/delete-snippet/${selectedSnippet.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
      setSnippets(prev => prev.filter(snippet => snippet.id !== selectedSnippet.id));
      setShowConfirmDeletionModal(false);
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Deletion failed!");
    }
  };

  const renderSnippetList = () => {
    if (filteredSnippets.length === 0) {
      return <p>No snippets match your search or filter.</p>;
    }

    return filteredSnippets.map(snippet => (
      <div
        className='snippet-card'
        key={snippet.id}
        onClick={() => setExpandedId(expandedId === snippet.id ? null : snippet.id)}
      >
        <h3>{snippet.title}</h3>
        <span className='badge'>{snippet.language}</span>
        <div>
          {snippet.tags.map(tag => <span key={tag} className='tag'>{tag}</span>)}
        </div>
        <p>{snippet.description}</p>

        <div className="snippet-actions">
          <button
            className="snippet-btn update-btn"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSnippet(snippet);
              setShowUpdateCodeSnippetModal(true);
            }}
          >
            <FiEdit /> Update
          </button>

          <button
            className="snippet-btn delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSnippet(snippet);
              setShowConfirmDeletionModal(true);
            }}
          >
            <FiTrash2 /> Delete
          </button>
        </div>

        {expandedId === snippet.id && (
          <SyntaxHighlighter
            language={
              snippet.language.toLowerCase() === 'mysql' ? 'sql' : snippet.language.toLowerCase()
            }
            style={atomOneLight}
            showLineNumbers
          >
            {snippet.codeSnippet}
          </SyntaxHighlighter>

        )}
      </div>
    ));
  };

  return (
    <div className='snippets-container'>
      {snippets.length === 0 ? (
        <>
          <p>No snippets found</p>
          <div className='btn-2'>
            <button className='add-snippet-btn-2' onClick={() => setShowAddSnippetModal(true)}>
              + Add Snippet
            </button>
          </div>
        </>
      ) : (
        <>
          <div className='snippets-header'>
            <h2 className='comp-heading'>Hey developer! here are your code snippets..</h2>
            <button className='add-snippet-btn' onClick={() => setShowAddSnippetModal(true)}>+ Add Snippet</button>
          </div>

          <div className='snippets-controls'>
            <input
              type='text'
              placeholder='🔍 Search snippets by title'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)}>
              <option value=''>All Languages</option>
              <option value='javascript'>JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="mysql">MySQL</option>
            </select>
          </div>

          <div className='snippet-list'>
            {renderSnippetList()}
          </div>
        </>
      )}

      {/* Add Snippet Modal */}
      {showAddSnippetModal && (
        <div className='modal-overlay' onClick={() => setShowAddSnippetModal(false)}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <button className='close-btn' onClick={() => setShowAddSnippetModal(false)}>
              <IoClose />
            </button>
            <AddSnippetModal />
          </div>
        </div>
      )}

      {/* Update Snippet Modal */}
      {showUpdateCodeSnippetModal && selectedSnippet && (
        <div className='modal-overlay' onClick={() => {
          setShowUpdateCodeSnippetModal(false);
          setSelectedSnippet(null);
        }}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <button className='close-btn' onClick={() => setShowUpdateCodeSnippetModal(false)}>
              <IoClose />
            </button>
            <UpdateCodeSnippetModal snippet={selectedSnippet} onUpdateComplete={handleUpdateComplete} />
          </div>
        </div>
      )}

      {/* Confirm Deletion Modal */}
      {showConfirmDeletionModal && selectedSnippet && (
        <div className='modal-overlay' onClick={() => {
          setShowConfirmDeletionModal(false);
          setSelectedSnippet(null);
        }}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <ConfirmDeletionModal
              snippet={selectedSnippet}
              onConfirm={handleDeleteSnippet}
              onCancel={() => {
                setShowConfirmDeletionModal(false);
                setSelectedSnippet(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Snippets;
