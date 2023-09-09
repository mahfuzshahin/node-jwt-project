const express = require("express");
const Product = require("./model/product");
const Category = require("./model/category")
const auth = require("./middleware/auth")
const jwt = require("jsonwebtoken");
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const product = express()
product.use(express.json());

product.post("/category", auth, async (req, res)=>{
    try {
        const {name, type} = req.body;
        if(!(name && type)){
            res.status(400).json({message: "Required"});
        }

        const user = req.user.user_id;
        const category = await Category.create({
            name, type, user_id:user
        }).then((err, category)=>{
            if(err){
                res.send(err);
            }else {
                res.status(200).json(category);
            }
        });
    }catch (err){
        console.log(err)
    }
});
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
});

product.get("/product", auth, async (req, res)=>{
    Product.find().then((err, products)=>{
        if(err){
            res.send(err);
        }
        res.json(products)
    })
});
product.get("/product/:productID", auth, async (req, res)=>{

    try {
        const product = await Product.findById(req.params.productID).populate('user_id');

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const productName = product.name || 'No Name';
        const productPrice = product.price || 0; // Use a suitable default price
        const name = product.user_id ? product.user_id.first_name+' '+product.user_id.last_name : 'Unknown User';
        const email = product.user_id.email;

        res.json({ name: productName, price: productPrice, data: {name: name, email:email} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }

    // Product.findById(req.params.productID).populate('user_id').then((product)=>{
    //     if(!product){
    //         res.status(404).json({ error: 'Product not found' });
    //     }else {
    //         const productName = product.name;
    //         const productPrice = product.price;
    //         const addedBy = product.user_id.first_name;
    //         res.json({name: productName, price: productPrice, addedBy: addedBy})
    //     }
    // }).catch((err) => {
    //     res.status(500).json(err);
    // });
})

module.exports = product