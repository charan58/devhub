import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: [true, "*title is required"],
    },
    language: {
        type: String,
        required: [true, "*language is required"],
        enum: ['JavaScript', 'Java', 'MySQL', 'Python'],
    },
    codeSnippet: {
        type: String,
        required: [true, "*code snippet is required"],
    },
    description: {
        type: String,
        default: "",
    },
    tags: {
        type: Array
    },
    createdAt: {
        type: Date,
        required: true
    }


}, { timestamps: true });

const Snippet = mongoose.model("Snippet", snippetSchema);

export default Snippet;