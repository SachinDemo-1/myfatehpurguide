const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const notifRoutes = require('./routes/notifications');

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notifRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.listen(PORT, () => console.log(`✅ Server on http://localhost:${PORT}`));
