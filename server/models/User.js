import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: [true, "*username is required"],
        minlength: [4, "*minimum 4 characters required"],
        maxlength: [10, "*maximum 10 characters allowed"],
        match: [/^[A-Za-z][A-Za-z0-9_]{3,10}$/, "*invalid username format"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "*email is required"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "*invalid email format"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "*password is required"],
        minlength: [6, "*minimum 6 characters required"],
        match: [ /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, 
                 "*Password must contain upper, lower, number & special character" ]
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;