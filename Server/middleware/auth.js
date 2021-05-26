const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../multipurposeFunction/keys");
const userModel = require("../../model/users");

exports.loginCheck = (req,res,next) => {
    try {
        let token = req.headers.token;
        token = token.replace("Bearer", "");
        decode = jwt.verify(token,JWT_SECRET);
        req.userDetails = decode;
        next();
    } catch (err) {
        res.json({
            error: "You must be logged in",
        });
    }
};

exports.isAuth = (req,res,next) => {
    let { loggeddInUserId } = req.body;
    if(
        !loggeddInUserId ||
        !req.userDetails._id ||
        loggeddInUserId != req.userDetails._id
    ) {
        res.status(403).json({ error: "You are not authenticated" });
    }
    next();
};

exports.isAdmin = async (req,res,next) => {
    try {
        let reqUser = await userModel.findById(req.body.loggeddInUserId);
        if(reqUser.userRole ===0) {
            res.status(403).json({ error: "Access denied "});
        }
        next();
    } catch {
        res.status(404);
    }
};
