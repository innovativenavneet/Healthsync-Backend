const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI environment variable is not set');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};
// calling mongodb funtion 
connectDB();

const patientRoutes = require('./routes/patientRoutes');
const transcribeRoutes = require('./routes/transcribeRoutes');
const mailerRoutes = require('./routes/mailerRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();

// CORS configuration for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://healthsync-backend-2qcw.onrender.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'HealthSync Backend is running' });
});

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/transcribe', transcribeRoutes);
app.use('/api/mail', mailerRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
