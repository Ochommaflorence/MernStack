const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required: true,
            maxlength:32,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            index: { unique: true },
            match:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        },
        password: {
            type: String,
            required: true,
        },
        userRole: {
            type: Number,
            required: true,
        },
        phoneNumber: {
            type: Number,
        },
        userImage: {
            type: String,
            default: "user.png",
        },
        verified: {
            type: String,
            default: false,
        },
        secretKey: {
            type: String,
            default: null,
        },
        history: {
            type: Array,
            default: [],
        },
    },
 { timestamps : true }
 
);

 const userModel = mongoose.model("users", userSchema);
   module.exports = userModel;