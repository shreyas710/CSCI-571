const User = require('../models/userModel');
const generateToken = require('../config/jwt');
const crypto = require('crypto');
const axios = require('axios');

// create gravatar for user
function getInitials(name) {
    const words = name.split(' ');
    let initials = '';

    for (const word of words) {
        if (word.length > 0) {
            initials += word[0].toUpperCase();
        }
    }
    return initials;
}

const createGravatar = (email, name) => {
    console.log(email);
    const hash = crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?d=initials&initials=${getInitials(name)}&s=200&r=pg`;
}

// get user profile
const getUserProfile = async (req, res) => {
    try {
        if (req.user) {
            res.status(200);
            res.json({
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                pic: req.user.pic,
                token: req.user.token,
            });
        } else {
            res.status(404);
            throw new Error("User not found");
        }
    }
    catch (error) {
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
        const pic = createGravatar(email, name);
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

// delete user account
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            await user.deleteOne();
            res.json({ message: "User removed" });
        } else {
            res.status(404);
            throw new Error("User not found");
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getUserProfile, registerUser, loginUser, deleteUser };