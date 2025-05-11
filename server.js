const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config({ path: './config/.env' });


const patientRoutes = require('./routes/patientRoutes');
const transcribeRoutes = require('./routes/transcribeRoutes');
const mailerRoutes = require('./routes/mailerRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/transcribe', transcribeRoutes);
app.use('/api/mail', mailerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
