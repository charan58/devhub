import express from "express";
import expressAsyncHandler from "express-async-handler";
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from "../middleware/authMiddleware.js";
import Bookmark from "../models/Bookmark.js";

const bookmarkApp = express.Router();
bookmarkApp.use(express.json());

// create a bookmark
bookmarkApp.post('/create-bookmark', verifyToken, expressAsyncHandler(async (req, res) => {
    // get collection
    const bookmarkcollection = req.app.get('bookmarks');

    // body
    const { bookmarkTitle, bookmarkUrl } = req.body;

    // new bookmark
    const bookmarkId = uuidv4();
    // user id
    const userId = req.user.id;

    const newBookmark = new Bookmark({ bookmarkId, userId, 
        bookmarkTitle, bookmarkUrl, createdAt: new Date()});

    // save
    await bookmarkcollection.insertOne(newBookmark.toObject());

    res.status(201).send({ message: "New bookmark created!", newBookmark: newBookmark });
}))

// get bookmarks
bookmarkApp.get('/get-bookmarks', verifyToken, expressAsyncHandler(async (req, res) => {
    // get collection
    const bookmarkcollection = req.app.get('bookmarks');

    const bookmarks = await bookmarkcollection.find({}).toArray();
    if(!bookmarks || bookmarks.length === 0){
        return res.status(404).send({message: "No bookmarks found!"});
    }

    res.status(200).send({message: "Bookmarks fetch successfull!", payload: bookmarks})

}))

// delete bookmark
bookmarkApp.delete('/delete-bookmark/:id', verifyToken, expressAsyncHandler(async (req, res) => {
    // get collection
    const bookmarkcollection = req.app.get('bookmarks');

    // fetch id
    const bookmarkId = req.params.id;

    // find the bookmark
    const isBookmarkExist = await bookmarkcollection.findOne({bookmarkId: bookmarkId});

    if(isBookmarkExist){
        const deleteResult = await bookmarkcollection.deleteOne({bookmarkId: bookmarkId});
    }else{
        res.status(404).send({message: "No bookmark found!"});
    }

    res.status(200).send({message: "Bookmark deleted"})
}));

// get bookmark counts
bookmarkApp.get('/get-bookmark-count', verifyToken, expressAsyncHandler(async(req, res)=>{
    // get collection
    const bookmarkcollection = req.app.get('bookmarks');

    // get user
    const userId = req.user.id;
    // get count
    const numBookmarks = await bookmarkcollection.count({userId: userId});

    res.status(200).send({message: "Bookmarks count: ", payload: numBookmarks});
}))

export default bookmarkApp;