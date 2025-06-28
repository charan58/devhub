import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
    bookmarkId:{
        type: String,
        required: true,
        unique: true
    },
    userId:{
        type: String,
        required: true,
        unique: true
    },
    bookmarkTitle:{
        type: String,
        required: true
    },
    bookmarkUrl:{
        type: String,
        required: true
    },
    createdAt: {
    type: Date,
    required: true
  }
},{timestamps: true})

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;