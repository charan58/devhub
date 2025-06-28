import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function AddLearningModal() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleAddLearning = async (learningObj) => {
    try {
      const response = await axios.post('http://localhost:4000/learning-api/create-learning', learningObj, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      if (response.status === 201) {
        
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }
  return (
    <div className="add-container">
      <div className="add-content">
        <form onSubmit={handleSubmit(handleAddLearning)}>
          <h3>Add learning</h3>
          <div className="form-field">
            <label className="form-label" htmlFor="learning">Learning</label>
            <input
              type="text"
              id="learning"
              placeholder="Topic name"
              {...register("topic", { required: "*topic is required" })}
            />
            {errors.learning && <p className="text-error">{errors.learning.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="">Resource Links</label>
            <input
              type="text"
              placeholder="Enter links separate with comma"
              {...register("resourceLinks", { required: true })}
            />
            {errors.learning && <p className="text-error">{errors.learning.message}</p>}
          </div>

          <div>
            <button className='form-btn' type='submit' >Add</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddLearningModal