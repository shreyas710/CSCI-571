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
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(401);
            res.json({ message: "User with this email already exists." });
            throw new Error("User already exists");
        }
        const pic = await createGravatar(email);
        const user = await User.create({ name, email, password, pic });
        if (user) {
            const userToken = generateToken(user._id);
            res.cookie('userToken', userToken, { maxAge: 3600000 });
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: userToken,
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
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            const userToken = generateToken(user._id);
            res.cookie('userToken', userToken, { maxAge: 3600000 });
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: userToken,
            });
        } else {
            res.status(401);
            res.json({ message: "Password or email is incorrect." });
            throw new Error("Invalid email or password");
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = { registerUser, loginUser };