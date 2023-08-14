const mongoose = require("mongoose");
const connectDB = mongoose.connect(process.env.DB_URL);

module.exports = connectDB;
