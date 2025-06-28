import { toast } from 'react-toastify';
import './ConfirmDeletionModal.css';
import axios from 'axios';
function ConfirmDeletionModal({ snippet, onConfirm, onCancel, handleDeleteSnippet}) {


  return (
    <div className='confirm-modal'>
        <h3>Are you sure you want to delete <strong>{snippet?.title}</strong>?</h3>
        <div className="confirm-actions">
        <button className="yes-btn" onClick={onConfirm}>Yes</button>
        <button className="no-btn" onClick={onCancel}>No</button>
      </div>
    </div>
  )
}

export default ConfirmDeletionModal;