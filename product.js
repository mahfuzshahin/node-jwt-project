const express = require("express");
const Product = require("./model/product");
const auth = require("./middleware/auth")
const jwt = require("jsonwebtoken");
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const product = express()
product.use(express.json());
product.post("/product", auth, async (req, res)=>{
    try {
        const {name, price, description} = req.body;
        if(!(name && price && description)){
            res.status(400).json({message: "All input is required"})
        }
        const user = req.user.user_id
        const product = await Product.create({
            name,
            price,
            description,
            user_id:user
        }).then((err, product)=>{
            if(err){
                res.send(err);
            }else {
                res.status(200).json(product);
            }
        });

    }catch (err){
        console.log(err)
    }
})

module.exports = product