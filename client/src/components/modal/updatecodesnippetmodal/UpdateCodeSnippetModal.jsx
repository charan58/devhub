import './UpdateCodeSnippetModal.css';
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from 'axios';

function UpdateCodeSnippetModal({ snippet, onUpdateComplete }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: snippet.title,
      language: snippet.language,
      codeSnippet: snippet.codeSnippet,
      description: snippet.description
    }
  });

  const handleUpdatecSnippet = async (data) => {
    // Filter only updatable fields
    const allowedFields = ['title', 'codeSnippet', 'description'];

    const filteredUpdate = Object.fromEntries(
      Object.entries(data).filter(([key]) => allowedFields.includes(key))
    );


    try {
      const response = await axios.patch(`http://localhost:4000/snippet-api/update-snippet/${snippet.id}`, filteredUpdate, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      const updatedSnippet = {
        ...snippet,
        ...filteredUpdate,
      };
      onUpdateComplete(updatedSnippet);
      toast.success("Updated Succesfully!");
    } catch (error) {
      toast.error("Failed to update!");
    }
  };

  return (
    <div className="update-container">
      <div className="update-content">
        <form onSubmit={handleSubmit(handleUpdatecSnippet)}>
          <h3 className=''>What you wanna update??</h3>

          <div className='form-field'>
            <label className='form-label' htmlFor='title'>Title</label>
            <input
              type='text'
              id='title'
              {...register("title", { required: "*title required" })}
            />
            {errors.title && <p className='text-error'>{errors.title.message}</p>}
          </div>

          <div className='form-field'>
            <label htmlFor='language'>Language</label>
            <input
              type="text"
              id="language"
              disabled
              {...register("language")}
            />
          </div>

          <div className='form-field'>
            <label>Code Snippet</label>
            <textarea
              placeholder="Code snippet"
              {...register("codeSnippet", { required: "*code snippet required" })}
            />
            {errors.codeSnippet && <p className='text-error'>{errors.codeSnippet.message}</p>}
          </div>

          <div className='form-field'>
            <label>Description</label>
            <textarea
              placeholder='Short description'
              {...register("description")}
            />
            {errors.description && <p>{errors.description.message}</p>}
          </div>

          <div>
            <button className='form-btn' type='submit'>Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateCodeSnippetModal;
