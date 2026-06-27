const express = require('express');
const { notifications } = require('../data/store');
const { authenticateUser } = require('../middleware/auth');
const router = express.Router();

// User gets their notifications
router.get('/', authenticateUser, (req, res) => {
  const mine = notifications.filter(n => n.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ notifications: mine, unread: mine.filter(n => !n.read).length });
});

// Mark all read
router.patch('/read-all', authenticateUser, (req, res) => {
  notifications.filter(n => n.userId === req.user.id).forEach(n => n.read = true);
  res.json({ message: 'All marked read.' });
});

module.exports = router;
