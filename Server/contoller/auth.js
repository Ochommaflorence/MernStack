const { toTitleCase, validateEmail } = require("../multipurposeFunction/function");
const bcrypt = require("bcrypt");
const userModel = require("../model/users");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../multipurposeFunction/keys");


class Auth {
    async isAdmin(req,res){
        let { loggedInUserId }= req.body;
        try {
            let loggedInUserRole = await userModel.findById(loggedInUserId);
            res.json({ role:loggedInUserRole.userRole});
        } catch {
            res.status(404);
        }
    }

    async allUser(req,res) {
        try {
            try {
                let allUser = await userModel.find({});
                res.json({ users: allUser });
            } catch {
                res.status(404);
            }
        }
    }

    async postSignup(req,res) {
        let { name, email, password, cPassword } = req.body;
        let error = {};
        if(!name || !email || !password || !cPassword) {
            error = {
                ...error,
                name: "Field must not be empty",
                emai: "Field must not be empty",
                password: "Field must not be empty",
                cPassword: "Field must not be empty",
            };
            return res.json({ error });
        }
        if(name.length <3 || name.length>35) {
            error= { ...error, name: "Name must be 3-25 character" };
            return res.json({ error });
        } else {
            if (validateEmail(email)){
                name = toTitleCase(name);
                if((password.length>155 || (password.length<8))) {
                    error = {
                        ...error,
                        password: "Password must be 8 character",
                        name: "",
                        email: "",
                    };
                    return res.json({ error });
                } else {
                    try {
                        password = bcrypt.hashSync(password, 10);
                        const data = await userModel.findOne({ email: email });
                        if(data) {
                            error = {
                                ...error,
                                password: "",
                                name: "",
                                email: "Email already exists",
                            };
                            return res.json({ error });
                        } else {
                            let newUser = new userModel({
                                name,
                                email,
                                password,
                                userRole: 0,
                            });
                            newUser
                             .save()
                             .then((data)=> {
                                 return res.json({
                                     success: "Account create successfully,Please login",
                                 });
                             })
                             .catch((err)=> {
                                 console.log(err);
                             });
                        }
                    } catch(err) {
                        console.log(err);
                    }
                }
            } else {
                error = {
                    ...error,
                    password: "",
                    name: "",
                    email: "Email is not valid",
                };
                return res.json({ error });
            }
        }
    }

    async postSignin(req,res) {
        let { email, password } = req.body;
        if(!email || !password) {
            return res.json({
                error: "Fields must not be empty",
            });
        }
        try {
            const data = await userModel.findOne({ email:email });
            if(!data) {
                return res.json({
                    error: "Invaild email and password, please sign up",
                });
            } else {
                const login = await bcrypt.compare(password, data.password);
                if(login) {
                    const token = jwt.sign(
                        { _id:data._id,role:data.userRole },
                        JWT_SECRET
                    );
                    const encode =jwt.verify(token, JWT_SECRET);
                    return res.json({
                        token: token,
                        user: encode,
                    });
                } else {
                    return res.json({
                        error: "Invalid email or password",
                    });
                }
            }
        } catch(err) {
            console.log(err);
        }
    }
}

const authController = new Auth();
module.exports = authController;