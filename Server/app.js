const express = require("express");
const app =express();
require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");



app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended:false }));
app.use(express.json());

// Database connection
mongoose.connect(
    process.env.DATABASE_URL,
    { useNewUrlParser: true,  useCreateIndex: true,  useUnifiedTopology: true }
)
.then(()=>
console.log("Mongodb Connected successfully")
)
.catch((err)=>console.log("Database Not Connected!!!"))

const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=> {
    console.log("Server is running on", PORT);
});

