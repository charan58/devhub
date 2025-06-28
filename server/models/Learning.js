import mongoose from "mongoose";

const learningSchema = new mongoose.Schema({
    learningId: {
        type: String,
        required: true,
        unique: true
    },
    userId:{
        type: String,
        required: true,
        unique: true
    },
    topic: {
        type: String,
        required: true
    },
    resourceLinks: {
        type: [String],
        required:true,
        default: []
    },
    createdAt: {
    type: Date,
    required: true
  }

}, { timestamps: true });

const Learning = mongoose.model("Learning", learningSchema);
export default Learning;