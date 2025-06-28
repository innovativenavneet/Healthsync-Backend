// it will handle signup , login and with google sign-in 
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const validator = require('validator');

// Signup function
const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name) return res.status(400).json({ error: "Name is required" });
        if (!email) return res.status(400).json({ error: "Email is required" });
        if (!password) return res.status(400).json({ error: "Password is required" });
        if (!role) return res.status(400).json({ error: "Role is required" });
        if (!validator.isEmail(email)) return res.status(400).json({ error: "Invalid email format" });
        if (password.length < 5) return res.status(400).json({ error: "Password must be at least 5 characters" });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY);
        res.status(201).json({
            message: "Signup successful",
            token,
            user: { name, email, role }
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });
        if (!password) return res.status(400).json({ error: "Password is required" });

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY);
        res.status(200).json({
            message: "Login successful",
            token,
            user: { name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { token: googleToken, role } = req.body;
        if (!googleToken) return res.status(400).json({ error: "Google token is required" });

        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        let user = await User.findOne({ email: payload.email });

        if (!user) {
            if (!role) return res.status(400).json({ error: "Role is required for new users" });
            user = new User({
                name: payload.name,
                email: payload.email,
                googleId: payload.sub,
                role,
            });
            await user.save();
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY);
        res.status(200).json({
            message: user.googleId ? "Google login successful" : "Google signup successful",
            token,
            user: { name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: "Google authentication failed" });
    }
};

module.exports = { signup, login, googleLogin };