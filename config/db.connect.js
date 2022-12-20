const mongoose = require("mongoose");
require("dotenv").config();
const mongo_url = "mongodb+srv://madhusudan:madhusudan@authentication.aczkfhg.mongodb.net/auth-users?retryWrites=true&w=majority";

const connectDB = mongoose.connect(mongo_url);

module.exports = connectDB;
