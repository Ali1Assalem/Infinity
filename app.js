const express = require("express");
const connectToDb = require("./config/connectToDb")
require("dotenv").config()

connectToDb()

const app = express();

app.use(express.json())

const PORT = process.env.PORT || 8000
app.listen(PORT,()=> console.log(`server is running in ${process.env.MODE_ENV} mode on port ${PORT}`))