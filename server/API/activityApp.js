import express from 'express';
import expressAsyncHandler from 'express-async-handler';
const activityApp = express.Router();

activityApp.get(
  '/get-recent',
  expressAsyncHandler(async (req, res) => {
    const userId = req.user.id;

    const db = req.app.get('devhub');

    const [snippets, logs, bookmarks, learnings] = await Promise.all([
      db.collection("snippets").find({ userId }).sort({ createdAt: -1 }).limit(1).toArray(),
      db.collection("logs").find({ userId }).sort({ createdAt: -1 }).limit(1).toArray(),
      db.collection("bookmarks").find({ userId }).sort({ createdAt: -1 }).limit(1).toArray(),
      db.collection("learnings").find({ userId }).sort({ createdAt: -1 }).limit(1).toArray(),
    ]);

    const activities = [];

    if (snippets[0]) {
      activities.push({
        type: "Snippet",
        title: snippets[0].title,
        createdAt: snippets[0].createdAt,
      });
    }

    if (logs[0]) {
      activities.push({
        type: "Log",
        title: logs[0].workedOn,
        createdAt: logs[0].createdAt,
      });
    }

    if (bookmarks[0]) {
      activities.push({
        type: "Bookmark",
        title: bookmarks[0].bookmarkTitle,
        createdAt: bookmarks[0].createdAt,
      });
    }

    if (learnings[0]) {
      activities.push({
        type: "Learning",
        title: learnings[0].topic,
        createdAt: learnings[0].createdAt,
      });
    }

    // Sort by most recent first
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ activities });
  })
);

export default activityApp;