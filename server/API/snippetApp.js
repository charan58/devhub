import express from "express";
import expressAsyncHandler from "express-async-handler";
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from '../middleware/authMiddleware.js';
import Snippet from "../models/Snippet.js";
import { extractTags } from "../utils/extractTags.js";

const snippetApp = express.Router();

// body parser
snippetApp.use(express.json());

// Get Snippets
snippetApp.get('/get-snippets', verifyToken, expressAsyncHandler(async (req, res) => {

    // get collection
    const snippetcollection = req.app.get('snippets');

    // get snippets
    const snippets = await snippetcollection.find({}).toArray();

    if (!snippets || snippets.length === 0) {
        return res.status(404).send({ message: "No code snippets found." });
    }

    // send response
    res.status(200).send({ mesage: "snippet fetch successfull!", payload: snippets });
}));

// Create Snippet
snippetApp.post('/create-snippet', verifyToken, expressAsyncHandler(async (req, res) => {

    // Request Body
    const { title, language, codeSnippet, description } = req.body;

    // get collection
    const snippetcollection = req.app.get('snippets');

    // id for snippet
    const id = uuidv4();

    // user id
    const userId = req.user.id;

    // fetch tags
    const tags = extractTags(codeSnippet, language);

    // newSnippet
    const newSnippet = new Snippet({
        id, userId, title, language, codeSnippet, description, tags,
        createdAt: new Date()
    });

    // save
    await snippetcollection.insertOne(newSnippet.toObject());

    // send response
    res.status(201).send({ message: "new snippet created.", snippetId: id })

}))

// Update Snippet by id (PATCH)
snippetApp.patch('/update-snippet/:id', verifyToken, expressAsyncHandler(async (req, res) => {
    // get id
    const snippetId = req.params.id;

    const snippetcollection = req.app.get('snippets');

    const { title, codeSnippet, description } = req.body;

    // Validate
    if (!title && !codeSnippet && !description) {
        return res.status(400).json({ message: 'At least one field must be provided for update.' });
    }

    // update
    const updatedSnippet = await snippetcollection.findOneAndUpdate(
        { id: snippetId },
        { $set: { title, codeSnippet, description } },
        { returnDocument: 'after' }
    )

    if (!updatedSnippet) {
        return res.status(404).json({ message: "Update unsuccessful or snippet not found." });
    }

    res.status(200).send({ message: "Snippet update success", snippet: updatedSnippet })


}))


// Delete Snippets by id
snippetApp.delete('/delete-snippet/:id', verifyToken, expressAsyncHandler(async (req, res) => {
    // get id
    const snippetId = req.params.id;

    // get collection
    const snippetcollection = req.app.get('snippets');

    // check for that snippet
    const isSnippetExist = await snippetcollection.findOne({ id: snippetId })
    if (isSnippetExist) {
        // delete the snippet
        const deleteResult = await snippetcollection.deleteOne({ id: snippetId });
    } else {
        return res.status(404).send({ message: "Snippet not found" })
    }

    // if (deleteResult.deletedCount === 0) {
    //     return res.status(404).send({ message: "Snippet not found" });
    // }

    res.status(200).send({ message: "Snippet deleted successfully." })

}))

// get snippet count
snippetApp.get('/get-snippet-count', verifyToken, expressAsyncHandler(async (req, res) => {
    // get collection
    const snippetcollection = req.app.get('snippets');

    // get user id
    const userId = req.user.id;

    // get count
    const snippetCount = await snippetcollection.count({ userId: userId });

    // response
    res.status(200).send({ message: "Snippet count", payload: snippetCount });
}))

export default snippetApp;