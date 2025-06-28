import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import expressAsyncHandler from 'express-async-handler';
import Bcryptjs from 'bcryptjs';
import JsonWebToken from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
dotenv.config();

const userApp = express.Router();
// Body Parser
userApp.use(express.json());

// Register Route
userApp.post('/register', expressAsyncHandler(async (req, res) => {

    // Request Body
    const { username, email, password } = req.body; // {"id","username", "email", "password"}

    // Connect with the database
    const userscollection = req.app.get('users');

    // Check for email
    const existingUser = await userscollection.findOne({ email: email });

    if (existingUser) {
        return res.status(400).send({ message: "Email already registered" });
    }

    // Else new user
    const id = uuidv4();

    // newUser
    const newUser = new User({ id, username, email, password });

    const hashedPassword = await Bcryptjs.hash(newUser.password, 10);
    newUser.password = hashedPassword;

    await userscollection.insertOne(newUser);


    res.status(201).send({ message: "User registered successfully", userId: id });

}));



// Login Route
userApp.post('/login', expressAsyncHandler(async (req, res) => {

    // Get login object
    const { email, password } = req.body;

    // connect to database
    const userscollection = req.app.get('users');

    // Check for email
    const userInDb = await userscollection.findOne({ email: email });

    const { id, username } = userInDb;

    if (!userInDb) {
        return res.status(401).send({ message: "Invalid email or password" });
    }

    const isPasswordEqual = await Bcryptjs.compare(password, userInDb.password);
    
    if (!isPasswordEqual) {
        return res.status(401).send({ message: "Invalid email or password" });
    }

    const jwtToken = JsonWebToken.sign({ id: userInDb.id, username: userInDb.username }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.status(200).send({ token: jwtToken, user: { id, username } })
}))

export default userApp;