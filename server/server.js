import express from 'express';
import mongodb from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import userApp from './API/userApp.js';
import snippetApp from './API/snippetApp.js';
import logApp from './API/logApp.js';
import learningApp from './API/learningApp.js';
import bookmarkApp from './API/bookmarkApp.js';
import activityApp from './API/activityApp.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: 'https://devhub-peach.vercel.app',
  credentials: true, 
}));

app.use(express.static(path.join(__dirname, '../client/dist')))


const mongoClient = mongodb.MongoClient;

mongoClient.connect(process.env.MONGO_URL)
    .then(dbRef => {
        const dbObj = dbRef.db('devhub');
        const userscollection = dbObj.collection('users');
        const snippetcollection = dbObj.collection('snippets');
        const logcollection = dbObj.collection('logs');
        const learningcollection = dbObj.collection('learnings');
        const bookmarkcollection = dbObj.collection('bookmarks');

        app.set('users', userscollection);
        app.set('snippets', snippetcollection);
        app.set('logs', logcollection);
        app.set('learnings', learningcollection);
        app.set('bookmarks', bookmarkcollection);

        console.log("Connected to the Database Successfully.");

        // Use the user routes
        app.use('/user-api', userApp);
        app.use('/snippet-api', snippetApp);
        app.use('/log-api', logApp);
        app.use('/learning-api', learningApp);
        app.use('/bookmark-api', bookmarkApp);
        app.use('/activity-api', activityApp);

        // for invalid paths
        app.use(pathHandlingMiddleware);

        // Error handling middleware
        app.use(errorHandlingMiddleware);

        // Start server after DB connection is established
        app.listen(process.env.PORT, () => {
            console.log(`Server Listening on Port: ${process.env.PORT}`);
        });

    })
    .catch(error => {
        console.log("Error while connecting to the database is ", error.message);
    });

// 404 handler middleware
const pathHandlingMiddleware = (request, response, next) => {
    response.status(404).send({ message: "Invalid Path" });
};

// Error handler middleware (4 args!)
const errorHandlingMiddleware = (error, request, response, next) => {
    response.status(500).send({ message: error.message });
};
