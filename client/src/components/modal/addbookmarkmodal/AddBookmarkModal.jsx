import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
function AddBookmarkModal() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleAddBookmark = async (bookmarkObj) => {
        try {
            const response = await axios.post('http://localhost:4000/bookmark-api/create-bookmark', bookmarkObj,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )

            if(response.status === 201){
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to add a bookmark!")
        }
    }

    return (
        <div className="add-container">
            <div className="add-content">
                <form onSubmit={handleSubmit(handleAddBookmark)}>
                    <h3>Add Bookmark</h3>

                    <div className="form-label">
                        <label htmlFor="bookmarkTitle">Title</label>
                        <input
                            type="text"
                            placeholder="Bookmark Title"
                            {...register("bookmarkTitle", { required: "*bookmark title is required" })}
                        />

                        {errors.bookmarkTitle && <p className="text-error">{errors.bookmarkTitle.message}</p>}
                    </div>

                    <div className="form-label">
                        <label htmlFor="bookmarkUrl">Url</label>
                        <input
                            type="text"
                            placeholder="URL"
                            {...register("bookmarkUrl", { required: "*url is required" })}
                        />
                        {errors.bookmarkUrl && <p className="text-error">{errors.bookmarkUrl.message}</p>}
                    </div>

                    <div>
                        <button className="form-btn" type="submit">Add</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddBookmarkModal