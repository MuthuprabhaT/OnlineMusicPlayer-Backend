const express = require("express");
const cors = require("cors");
const dataBaseConnection = require("./database/dbConfig");
const userSignup = require("./routes/UserRoute/userSignup");
const userLogin = require("./routes/UserRoute/userLogin");
const forgotPassword = require("./routes/UserRoute/forgotPassword");
const verifyRandomString = require("./routes/UserRoute/verifyRandomString");
const resetPassword = require("./routes/UserRoute/resetPassword");
const songsRoute = require("./routes/SongRoute/songsRoute");

//Configuring the environmental variable
require("dotenv").config();

//Server setup
const app = express();

//Middlewares
app.use(express.json());
app.use(cors());

//Database connection
dataBaseConnection();

//Routes
app.use("/api/user/signup", userSignup);
app.use("/api/user/login", userLogin);
app.use("/api/user/forgotPassword", forgotPassword);
app.use("/api/user/verifyRandomString", verifyRandomString);
app.use("/api/user/resetPassword", resetPassword);
app.use("/api/songs", songsRoute);

//Listening the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT} port`);
});
