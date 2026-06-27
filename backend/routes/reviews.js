const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { reviews, bookings } = require('../data/store');
const { authenticateUser, authenticateOwner } = require('../middleware/auth');
const router = express.Router();

// Get all approved reviews (public)
router.get('/', (req, res) => {
  const approved = reviews.filter(r => r.approved).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const avgRating = approved.length ? (approved.reduce((s, r) => s + r.rating, 0) / approved.length).toFixed(1) : '5.0';
  res.json({ reviews: approved, total: approved.length, avgRating });
});

// User submits review (must have completed booking)
router.post('/', authenticateUser, (req, res) => {
  const { rating, comment, tourType, bookingId } = req.body;
  if (!rating || !comment) return res.status(400).json({ error: 'Rating and comment required.' });
  // check if user has a completed booking
  const hasCompleted = bookings.some(b => b.userId === req.user.id && b.status === 'Completed');
  if (!hasCompleted) return res.status(403).json({ error: 'You can only review after completing a tour.' });
  // check duplicate
  const already = reviews.find(r => r.userId === req.user.id && r.bookingId === bookingId);
  if (already) return res.status(409).json({ error: 'You already reviewed this booking.' });
  const review = {
    id: uuidv4(),
    userId: req.user.id,
    userName: req.user.name,
    userCountry: req.body.userCountry || '',
    tourType: tourType || '',
    bookingId: bookingId || '',
    rating: parseInt(rating),
    comment,
    approved: true,
    createdAt: new Date().toISOString(),
  };
  reviews.push(review);
  res.status(201).json({ message: 'Review submitted! Thank you.', review });
});

// Owner: get all reviews including unapproved
router.get('/all', authenticateOwner, (req, res) => {
  res.json({ reviews: [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
});

// Owner: approve/delete review
router.patch('/:id', authenticateOwner, (req, res) => {
  const r = reviews.find(x => x.id === req.params.id);
  if (!r) return res.status(404).json({ error: 'Not found' });
  Object.assign(r, req.body);
  res.json({ review: r });
});

router.delete('/:id', authenticateOwner, (req, res) => {
  const idx = reviews.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  reviews.splice(idx, 1);
  res.json({ message: 'Deleted.' });
});

module.exports = router;
