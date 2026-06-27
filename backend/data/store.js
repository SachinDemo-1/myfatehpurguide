const bcrypt = require('bcryptjs');
require('dotenv').config();
// ── In-memory data store ──────────────────────────────────────────────
const users = []; // registered tourists

const bookings = [];

const reviews = [
  {
    id: 'rev-001',
    userId: 'demo-1',
    userName: 'Sarah Mitchell',
    userCountry: 'United Kingdom',
    tourType: 'Complete Heritage Tour',
    rating: 5,
    comment: 'Mohammad Salim brought Akbar\'s court to life with vivid storytelling. Felt like standing in the 16th century. Absolutely unmissable!',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    approved: true,
  },
  {
    id: 'rev-002',
    userId: 'demo-2',
    userName: 'Hiroshi Tanaka',
    userCountry: 'Japan',
    tourType: 'Photography Special Tour',
    rating: 5,
    comment: 'The photography tour was exceptional. He knows exactly when the light hits each monument. My travel photos have never looked so good!',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    approved: true,
  },
  {
    id: 'rev-003',
    userId: 'demo-3',
    userName: 'Priya Sharma',
    userCountry: 'India',
    tourType: 'Family & Kids Tour',
    rating: 5,
    comment: 'Hamaari poori family ko yeh tour bahut pasand aayi. Bacchon ko itihas itni rochak tarike se samjhaya — shandaar!',
    createdAt: new Date(Date.now() - 21 * 86400000).toISOString(),
    approved: true,
  },
  {
    id: 'rev-004',
    userId: 'demo-4',
    userName: 'Carlos Rivera',
    userCountry: 'Spain',
    tourType: 'Deep History Tour',
    rating: 5,
    comment: 'Best money spent on this entire India trip. The deep history tour is worth every rupee. Salim sahab is a walking encyclopedia!',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    approved: true,
  },
];

const notifications = []; // per-user notifications
const owner = {
  username: process.env.OWNER_USERNAME || 'DineshgolaGuide',
  password: (process.env.OWNER_PASSWORD_HASH || '').replace(/^"|"$/g, ''),
  name: process.env.OWNER_NAME || 'Dinesh Chand Gola',
  role: 'owner',
};

module.exports = { users, bookings, reviews, notifications, owner };
