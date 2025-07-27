const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI environment variable is not set');
      console.log('💡 Please set your MongoDB connection string in config/.env');
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 Please check your MONGO_URI in config/.env');
    console.log('💡 Make sure your MongoDB Atlas cluster is running');
    process.exit(1);
  }
};

connectDB();

const patientRoutes = require('./routes/patientRoutes');
const transcribeRoutes = require('./routes/transcribeRoutes');
const mailerRoutes = require('./routes/mailerRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();

// CORS configuration for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
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
