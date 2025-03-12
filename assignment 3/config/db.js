const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://shreyask:%40Shreyas710%40@cluster0.rltx2xm.mongodb.net/CSCI571_ASSIGNMENT3");

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit with a non-zero status code to indicate an error
    }
};

module.exports = connectDB;