import express from "express";
import expressAsyncHandler from "express-async-handler";
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from "../middleware/authMiddleware.js";
import Learning from "../models/Learning.js";

const learningApp = express.Router();
learningApp.use(express.json());

// create learning
learningApp.post('/create-learning', verifyToken, expressAsyncHandler(async (req, res) => {
    // get collection
    const learningcollection = req.app.get('learnings');

    // get req object from body
    const { topic, resourceLinks } = req.body;

    const processedResourceLinks = Array.isArray(resourceLinks)
        ? resourceLinks
        : typeof resourceLinks === 'string'
            ? resourceLinks.split(',').map(link => link.trim()).filter(Boolean)
            : [];

    // id
    const learningId = uuidv4();
    // user id
    const userId = req.user.id;
    // new learning
    const newLearning = new Learning({
        learningId, userId, topic, resourceLinks: processedResourceLinks,
        createdAt: new Date()
    });

    // save
    await learningcollection.insertOne(newLearning.toObject());

    res.status(201).send({ message: "New learning created", payload: newLearning });
}))

// get learning
learningApp.get('/get-learnings', verifyToken, expressAsyncHandler(async (req, res) => {
    // get collection
    const learningcollection = req.app.get('learnings');

    const learnings = await learningcollection.find({}).toArray();
    if (!learnings || learnings.length === 0) {
        return res.status(404).send({ message: "No Learnings found" });
    }
    res.status(200).send({ message: "Learnings fetch suucess full", payload: learnings })
}))

// delete learning
learningApp.delete('/delete-learning/:id', verifyToken, expressAsyncHandler(async (req, res) => {
    // get collection
    const learningcollection = req.app.get('learnings');

    const learningId = req.params.id;

    // check for that learning
    const isLearningExist = await learningcollection.findOne({ learningId: learningId });

    if (isLearningExist) {
        const deleteResult = await learningcollection.deleteOne({ learningId: learningId });
    } else {
        return res.status(404).send({ message: "No learning found" })
    }


    // if (deleteResult.deletedCount === 0) {
    //     return res.status(404).send({ message: "Learning not found" });
    // }

    res.status(200).send({ message: "Learning deleted Successfully!" })

}));

// get bookmark counts
learningApp.get('/get-learning-count', verifyToken, expressAsyncHandler(async (req, res) => {
    // get collection
    const learningcollection = req.app.get('learnings');

    // get user
    const userId = req.user.id;
    // get count
    const numLearnings = await learningcollection.count({ userId: userId });

    res.status(200).send({ message: "Learnings count: ", payload: numLearnings });
}))

export default learningApp;