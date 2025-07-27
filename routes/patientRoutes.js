const express = require('express');
const { 
  getPatients, 
  getPatientById, 
  createPatient, 
  updatePatient, 
  addMedicalHistory 
} = require('../controllers/patientController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all patients for the authenticated doctor
router.get('/', getPatients);

// Get a specific patient by ID
router.get('/:id', getPatientById);

// Create a new patient
router.post('/', createPatient);

// Update a patient
router.put('/:id', updatePatient);

// Add medical history to a patient
router.post('/:id/medical-history', addMedicalHistory);

module.exports = router;
