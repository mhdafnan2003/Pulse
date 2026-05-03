require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve existing Pulse static assets (images used in slides)
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/slides', require('./routes/slides'));
app.use('/api/home-content', require('./routes/homeContent'));
app.use('/api/service-content', require('./routes/servicePageContent'));
app.use('/api/contact-content', require('./routes/contactContent'));
app.use('/api/upload', require('./routes/upload'));
 
 // Root route
 app.get('/', (req, res) => {
   res.send('<h1>Pulse Creative & Consulting API</h1><p>Server is running. Access the frontend at <a href="http://localhost:5173">http://localhost:5173</a></p>');
 });

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
