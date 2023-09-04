require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const User = require("./model/user")
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth")
app.use(express.json());

app.post("/register", async (req,res)=>{
    try {
        const {first_name, last_name, email, password} = req.body;
        if(!(email && password && first_name && last_name)){
            res.status(400).json({message: "All input is required"})
        }
        const oldUser = await User.findOne({email});
        if(oldUser){
            return res.status(409).json({message: "User Already Exist. Please Login"})
        }
        encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
                first_name,
                last_name,
                email: email.toLowerCase(),
                password: encryptedPassword,
            });
        const token = jwt.sign(
                { user_id: user._id, email},
                        process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );
        user.token = token;
        console.log()
        res.status(201).json(user);
    }catch (err){
        console.log(err)
    }
});

app.post("/login", async (req,res)=>{
    try{
        const {email, password} = req.body;
        if(!(email && password)){
            res.status(400).json({message: "All input is required"})
        }
        const user = await User.findOne({email});
        if(user && (await bcrypt.compare(password, user.password))){
            const token = jwt.sign(
                {user_id: user._id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }

            );
            user.token = token;
            res.status(200).json(user);
        }
        res.status(400).json({message: "Invalid Credentials"})

    }catch (err){
        console.log(err)
    }
});
app.get("/welcome", auth, (req, res) => {
    res.status(200).json({message:"Welcome 🙌 "});
});

module.exports = app;
