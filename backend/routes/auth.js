const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { users, owner } = require('../data/store');
const { JWT_SECRET } = require('../middleware/auth');
const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  const { name, email, password, phone, nationality } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required.' });
  if (users.find(u => u.email === email)) return res.status(409).json({ error: 'Email already registered.' });
  const hashed = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), name, email, phone: phone || '', nationality: nationality || '', password: hashed, role: 'user', createdAt: new Date().toISOString() };
  users.push(user);
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

  // Check if owner login via email field = username
  if (email === owner.username || email === 'admin') {
    const match = await bcrypt.compare(password, owner.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials.' });
    const token = jwt.sign({ username: owner.username, name: owner.name, role: 'owner' }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, user: { name: owner.name, role: 'owner' } });
  }

  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'No account found with this email.' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid password.' });
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: 'user' } });
});

// Owner login (separate endpoint)
router.post('/owner-login', async (req, res) => {
  const { username, password } = req.body;
  if (username !== owner.username) return res.status(401).json({ error: 'Invalid credentials.' });
  const match = await bcrypt.compare(password, owner.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials.' });
  const token = jwt.sign({ username: owner.username, name: owner.name, role: 'owner' }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, name: owner.name });
});

// Get current user profile
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === 'owner') return res.json({ user: { name: decoded.name, role: 'owner' } });
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password, ...safe } = user;
    res.json({ user: safe });
  } catch { res.status(401).json({ error: 'Invalid token' }); }
});

module.exports = router;
