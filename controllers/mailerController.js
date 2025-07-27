const nodemailer = require('nodemailer');
const Patient = require('../models/patientModel');

const sendMail = async (req, res) => {
  try {
    const { patientId, subject, text } = req.body;

    if (!patientId || !subject || !text) {
      return res.status(400).json({ 
        error: 'Patient ID, subject, and text are required' 
      });
    }

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Access denied. Doctors only.' });
    }

    // Find the patient and verify they belong to this doctor
    const patient = await Patient.findOne({
      _id: patientId,
      assignedDoctor: req.user.id
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patient.email,
      subject: subject,
      text: text
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', patient.email);
    
    res.status(200).json({ 
      message: 'Email sent successfully!',
      sentTo: patient.email
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

// Get all patients for email selection
const getPatientsForEmail = async (req, res) => {
  try {
    // Check if user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Access denied. Doctors only.' });
    }

    const patients = await Patient.find({ 
      assignedDoctor: req.user.id,
      status: 'active'
    }).select('name email');

    res.json({ success: true, patients });
  } catch (error) {
    console.error('Error fetching patients for email:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

module.exports = { sendMail, getPatientsForEmail };
