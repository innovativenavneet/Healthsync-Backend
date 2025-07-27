const Patient = require('../models/patientModel');

// Get all patients (for doctors)
const getPatients = async (req, res) => {
  try {
    // Check if user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Access denied. Doctors only.' });
    }

    const patients = await Patient.find({ assignedDoctor: req.user.id })
      .populate('assignedDoctor', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

// Get a specific patient
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      assignedDoctor: req.user.id
    }).populate('assignedDoctor', 'name email');

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ success: true, patient });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
};

// Create a new patient
const createPatient = async (req, res) => {
  try {
    // Check if user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Access denied. Doctors only.' });
    }

    const { name, email, phone, age, gender, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Check if patient with this email already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ error: 'Patient with this email already exists' });
    }

    const patient = new Patient({
      name,
      email,
      phone,
      age,
      gender,
      address,
      assignedDoctor: req.user.id
    });

    await patient.save();

    res.status(201).json({ 
      success: true, 
      message: 'Patient created successfully',
      patient 
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Failed to create patient' });
  }
};

// Update a patient
const updatePatient = async (req, res) => {
  try {
    // Check if user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Access denied. Doctors only.' });
    }

    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id, assignedDoctor: req.user.id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ 
      success: true, 
      message: 'Patient updated successfully',
      patient 
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: 'Failed to update patient' });
  }
};

// Add medical history to a patient
const addMedicalHistory = async (req, res) => {
  try {
    // Check if user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Access denied. Doctors only.' });
    }

    const { condition, diagnosis, prescription } = req.body;

    if (!condition || !diagnosis) {
      return res.status(400).json({ error: 'Condition and diagnosis are required' });
    }

    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id, assignedDoctor: req.user.id },
      {
        $push: {
          medicalHistory: {
            condition,
            diagnosis,
            prescription: prescription || ''
          }
        },
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ 
      success: true, 
      message: 'Medical history added successfully',
      patient 
    });
  } catch (error) {
    console.error('Error adding medical history:', error);
    res.status(500).json({ error: 'Failed to add medical history' });
  }
};

module.exports = { 
  getPatients, 
  getPatientById, 
  createPatient, 
  updatePatient, 
  addMedicalHistory 
};
  