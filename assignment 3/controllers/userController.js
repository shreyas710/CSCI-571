const User = require('../models/userModel');
const generateToken = require('../config/jwt');
const crypto = require('crypto');
const axios = require('axios');

// create gravatar for user
const createGravatar = async (email) => {
    try {
        const hash = crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex');

        const response = await axios.get(`https://api.gravatar.com/v3/profiles/${hash}`, {
            headers: {
                Authorization: `Bearer ${process.env.GRAVATAR_KEY}`,
            },
        });
        return response.data.avatar_url;
    } catch (error) {
        console.error(error);
    }
}

// register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400);
            throw new Error("Please Enter all the Feilds");
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error("User already exists");
        }
        const pic = await createGravatar(email);
        const user = await User.create({ name, email, password, pic });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error("User not found");
        }
    } catch (error) {
        console.error(error);
    }
}

// login a user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400);
            throw new Error("Please Enter all the Feilds");
        }
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error("Invalid email or password");
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = { registerUser, loginUser };