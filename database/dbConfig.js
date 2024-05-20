const mongoose = require('mongoose');

function dataBaseConnection(){
    try {
        mongoose.set("strictQuery", true);
        mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.log("MongoDB connection failed", error)
    }
}

module.exports = dataBaseConnection