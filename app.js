const express = require("express");
const connectToDb = require("./config/connectToDb")
require("dotenv").config()

connectToDb()

const app = express();

//Middleware
// body - raw application/json
app.use(express.json());

// body  x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


//Routes
app.use("/api/auth",require("./routes/authRoute"))
app.use("/api/users",require("./routes/usersRoute"))

const PORT = process.env.PORT || 8000
app.listen(PORT,()=> console.log(`server is running in ${process.env.MODE_ENV} mode on port ${PORT}`))