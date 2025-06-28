import express from "express";
import expressAsyncHandler from "express-async-handler";
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'date-fns'
import Log from '../models/log.js';
import { verifyToken } from "../middleware/authMiddleware.js";
const logApp = express.Router();
logApp.use(express.json());

// get logs
logApp.get('/get-logs', verifyToken, expressAsyncHandler(async (req, res) => {
    // get collection
    const logcollection = req.app.get('logs');

    const logs = await logcollection.find({}).toArray();

    if (!logs || logs.length === 0) {
        return res.status(404).send({ message: "No logs found" })
    }

    // send response
    res.status(200).send({ message: "Logs fetch successful", payload: logs });
}))


// create a log
logApp.post('/create-log', verifyToken, expressAsyncHandler(async (req, res) => {
    // fetch collection
    const logcollection = req.app.get('logs');
    // get body
    const { workedOn, blockers, notes, links, createdAt } = req.body;
    // generated id
    const logId = uuidv4();

    const processedLinks = Array.isArray(links)
        ? links : typeof links === 'string'
            ? links.split(',').map(link => link.trim()).filter(Boolean)
            : [];

    const logDate = parse(createdAt, 'dd-MM-yyyy', new Date());
    if (isNaN(logDate)) return res.status(500).send({ message: "An issue occured" });

    // user id
    const userId = req.user.id;
    
    
    // new log
    const newLog = new Log({ logId, userId, workedOn, blockers, 
        notes, links: processedLinks, createdAt: logDate });
        
    // save
    await logcollection.insertOne(newLog.toObject());

    res.status(201).send({ message: "New log created", newLog: newLog })
}));

// get logs count
logApp.get('/get-log-count', verifyToken, expressAsyncHandler(async(req, res)=>{
    // get collection
    const logcollection = req.app.get('logs');

    // get user
    const userId = req.user.id;
    // get count
    const numLogs = await logcollection.count({userId: userId});

    res.status(200).send({message: "Logs count: ", payload: numLogs});
}))
export default logApp;