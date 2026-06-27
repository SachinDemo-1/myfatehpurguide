const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { bookings, notifications } = require('../data/store');
const { authenticateOwner, authenticateUser } = require('../middleware/auth');
const router = express.Router();

// User creates booking (must be logged in)
router.post('/', authenticateUser, (req, res) => {
  const { visitDate, groupSize, language, tourType, specialRequests } = req.body;
  if (!visitDate || !groupSize) return res.status(400).json({ error: 'Visit date and group size required.' });
  const booking = {
    id: uuidv4(),
    userId: req.user.id,
    userName: req.user.name,
    userEmail: req.user.email,
    phone: req.body.phone || '',
    nationality: req.body.nationality || '',
    visitDate,
    groupSize: parseInt(groupSize),
    language: language || 'English',
    tourType: tourType || 'Complete Heritage Tour',
    specialRequests: specialRequests || '',
    status: 'Pending',
    ownerConfirmed: false,
    payment: { method: '', amount: 0, paid: false, notes: '' },
    bookedAt: new Date().toISOString(),
    completedAt: null,
  };
  bookings.push(booking);
  res.status(201).json({ message: 'Booking submitted! Awaiting confirmation.', bookingId: booking.id, booking });
});

// User gets their own bookings
router.get('/my', authenticateUser, (req, res) => {
  const myBookings = bookings.filter(b => b.userId === req.user.id)
    .sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
  // attach unread notifications
  res.json({ bookings: myBookings });
});

// Owner gets all bookings
router.get('/', authenticateOwner, (req, res) => {
  const sorted = [...bookings].sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
  res.json({ bookings: sorted, total: sorted.length });
});

// Owner confirms a booking → sends notification to user
router.patch('/:id/confirm', authenticateOwner, (req, res) => {
  const b = bookings.find(x => x.id === req.params.id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  b.status = 'Confirmed';
  b.ownerConfirmed = true;
  // push notification
  notifications.push({
    id: uuidv4(),
    userId: b.userId,
    type: 'booking_confirmed',
    message: `Your booking for "${b.tourType}" on ${new Date(b.visitDate).toDateString()} has been CONFIRMED by the guide! See you there.`,
    bookingId: b.id,
    read: false,
    createdAt: new Date().toISOString(),
  });
  res.json({ message: 'Booking confirmed. User notified.', booking: b });
});

// Owner marks as completed
router.patch('/:id/complete', authenticateOwner, (req, res) => {
  const b = bookings.find(x => x.id === req.params.id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  b.status = 'Completed';
  b.completedAt = new Date().toISOString();
  notifications.push({
    id: uuidv4(),
    userId: b.userId,
    type: 'tour_completed',
    message: `Your tour "${b.tourType}" is marked complete. We hope you had an amazing experience! Please leave a review.`,
    bookingId: b.id,
    read: false,
    createdAt: new Date().toISOString(),
  });
  res.json({ message: 'Marked completed.', booking: b });
});

// Owner updates payment
router.patch('/:id/payment', authenticateOwner, (req, res) => {
  const b = bookings.find(x => x.id === req.params.id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  b.payment = { ...b.payment, ...req.body };
  res.json({ message: 'Payment updated.', booking: b });
});

// Owner updates status (general)
router.patch('/:id', authenticateOwner, (req, res) => {
  const b = bookings.find(x => x.id === req.params.id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  Object.assign(b, req.body);
  res.json({ booking: b });
});

// Owner deletes
router.delete('/:id', authenticateOwner, (req, res) => {
  const idx = bookings.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  bookings.splice(idx, 1);
  res.json({ message: 'Deleted.' });
});

module.exports = router;
