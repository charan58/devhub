import './Bookmarks.css';
import { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import AddBookmarkModal from '../modal/addbookmarkmodal/AddBookmarkModal';
import { IoClose } from 'react-icons/io5';
import axios from 'axios';
import { useAuth } from '../contexts/useAuth';
import { toast } from 'react-toastify';

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get(`${API_BASE}/bookmark-api/get-bookmarks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        if (response.status === 200) {
          setBookmarks(response.data.payload);
        }
      } catch (error) {

      }
    }

    if (isAuthenticated) {
      fetchBookmarks();
    }
  }, []);

  const handleDeleteBookmark = async (bookmarkId) => {
    try {
      const response = await axios.delete(`${API_BASE}/bookmark-api/delete-bookmark/${bookmarkId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      if (response.status === 200) toast.info(response.data);
      setBookmarks(prev => prev.filter(b => b.bookmarkId !== bookmarkId));
    } catch (error) {

    }
  }

  return (
    <div className='bookmarks-container'>
      {bookmarks.length === 0 ? <>
      <p>You have no bookmarks.</p> <div className='btn-2'><button
        className="add-learning-btn"
        onClick={() => setShowBookmarkModal(!showBookmarkModal)}
      >
        + Add Bookmark
      </button></div>
      </> : <>
      <div className='bookmarks-header'>
        <h2 className='comp-list'>Bookmarks</h2>
        <button className='add-bookmark-btn' onClick={() => setShowBookmarkModal(!showBookmarkModal)}>+ Add Bookmark</button>
      </div>

      <div className='bookmarks-list'>
        {bookmarks.map((bookmark, index) =>
          <div className='bookmark-card' key={index}>
            <h3 >{bookmark.bookmarkTitle}</h3>
            <a href={bookmark.url} className='bookmark-link'><strong>{bookmark.bookmarkUrl}</strong></a>

            <div className='bookmark-controls'>
              <button className='bookmark-delete-btn' onClick={
                (e) => {
                  e.stopPropagation(),
                    handleDeleteBookmark(bookmark.bookmarkId)
                }
              }>
                <FiTrash2 /> Delete
              </button>
            </div>

          </div>
        )}
      </div></>}
      

      {showBookmarkModal && (
        <div className='modal-overlay' onClick={() => setShowBookmarkModal(!showBookmarkModal)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <button className='close-btn' onClick={() => setShowBookmarkModal(false)}><IoClose /></button>

            <AddBookmarkModal />
          </div>
        </div>
      )}

    </div>
  )
}

export default Bookmarks;