const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['doctor', 'patient'], required: true },
    googleId: String,
});

module.exports = mongoose.model('User', userSchema);
// This model will be used for both doctors and patients, differentiated by the 'role' field
// The 'googleId' field is used for Google sign-in functionality
// The 'password' field should be hashed before saving to the database