import './AddSnippetModal.css';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
function AddSnippetModal() {

  const languages = ['JavaScript', 'Java', 'MySQL', 'Python'];

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');

  const handleAddSnippet=async(snippetObj)=>{

    try {
      const response = await axios.post('http://localhost:4000/snippet-api/create-snippet', snippetObj,{
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }

      });
      if(response.status === 201){
        setError('');

        toast.success("New snippet created!")
      }
    } catch (error) {
        setError(error.response?.data?.message || error.message);
        toast.error("Failed to create new snippet!");
    }
  }

  return (
    <div className='add-container'>
      <div className='add-content'>
        <form onSubmit={handleSubmit(handleAddSnippet)}>
          {/* title */}
          <h3>Add your snippets</h3>
          <div className='form-field'>
            <label className='form-label' htmlFor='title'>Title</label>
            <input
              type='text'
              id='title'
              placeholder='Snippet title'
              {...register("title",{
                required: "*title required",
              })}
            />
            {errors.title && <p className='text-error'>{errors.title.message}</p>}
          </div>

          {/* language */}
          <div className='form-field'>
              <label htmlFor='language'>Language</label>
              <select 
                id='language' 
                {...register("language", {required:"*please select a language"})}
                defaultValue=''
              >
                <option value='' disabled defaultValue>Select a language</option>
                {
                  languages.map((language, index)=> <option key={index} value={language.toLowerCase()}>{language}</option>
                )}
              </select> 
              {errors.language && <p className='text-error'>{errors.language.message}</p>}
          </div>

          {/* code */}
          <div className='form-field'>
            <label>Code Snippet</label>
            <textarea
              placeholder='Code snippet'
              {...register("codeSnippet", {required:"*code snippet required"})}
            />
            {errors.codeSnippet && <p className='text-error'>{errors.codeSnippet.message}</p>}
          </div>

          {/* description */}
          <div className='form-field'>
              <label>Description</label>
              <textarea
                placeholder='Short description'
                {...register("description")}
              />
              {errors.description && <p>{errors.description.message}</p>}
          </div>

          <div>
            <button className='form-btn' type='submit' >Add Snippet</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddSnippetModal