import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

function AddLogModal({ formatDate }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleAddLog = async (logFormObj) => {
    const todayDate = new Date();
    const createdAt = formatDate(todayDate);
    const logObj = { ...logFormObj, createdAt };
    const API_BASE = import.meta.env.VITE_API_URL;

    try {
      const response = await axios.post(`${API_BASE}/log-api/create-log`, logObj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
    } catch (error) {
      toast.error("Error creating log:", error.response?.data || error.message);
    }
  }


  return (
    <div className='add-container'>
      <div className='add-content'>
        <form onSubmit={handleSubmit(handleAddLog)}>
          <h3>Add Log</h3>

          <div className='form-field'>
            <label className='form-label' htmlFor='workedOn'>Worked on</label>
            <input
              type='text'
              id='workedOn'
              placeholder='Log title'
              {...register("workedOn", {
                required: "*log title is required"
              })}
            />
            {errors.workedOn && <p className='text-error'>{errors.workedOn.message}</p>}
          </div>


          <div className='form-field'>
            <label>Blockers</label>
            <textarea
              placeholder='Short description of blockers'
              {...register("blockers")}
            />
            {errors.blockers && <p className='text-error'>{errors.blockers.message}</p>}
          </div>


          <div className='form-field'>
            <label>Notes</label>
            <textarea
              placeholder='Short notes'
              {...register("notes", { required: "*notes is required" })}
            />

            {errors.notes && <p className='text-error'>{errors.notes.message}</p>}
          </div>


          <div className='form-field'>
            <label htmlFor="links">Links</label>
            <input
              type="text"
              id="links"
              placeholder="Enter links separated by comma"
              {...register("links")}
            />
            {errors.links && <p className='text-error'>{errors.links.message}</p>}
          </div>


          <div>
            <button className='form-btn' type='submit' >Add</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddLogModal;