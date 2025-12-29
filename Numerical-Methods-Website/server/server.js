// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const calculationRoutes = require('./routes/calculationRoutes');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, '../client/build')));

// CORS support for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/finite-differences', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(err => {
  console.warn('MongoDB connection warning:', err.message);
  console.log('App will run without database persistence');
});

// Routes
app.use('/api', calculationRoutes);

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});