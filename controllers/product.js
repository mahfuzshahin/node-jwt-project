const express = require("express");
const Product = require("../model/product");
const Category = require("../model/category")
const auth = require("../middleware/auth")
const product = express()
product.use(express.json());

product.post("/category", auth, async (req, res)=>{
    try {
        const {name, type} = req.body;
        if(!(name && type)){
            res.status(400).json({message: "Required"});
        }

        const user = req.user.user_id;
        await Category.create({
            name, type, user_id:user
        }).then((err, category)=>{
            if(err){
                res.send(err);
            }else {
                res.status(200).json(category);
            }
        });
        console.log(user)
    }catch (err){
        console.log(err)
    }
});
product.post("/product", auth, async (req, res)=>{
    try {
        const {name, price, description, category_id} = req.body;
        if(!(name && price && description, category_id)){
            res.status(400).json({message: "All input is required"})
        }
        const user = req.user.user_id
        const product = await Product.create({
            name,
            price,
            description,
            category_id,
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

product.put("/product/:productID", auth, async(req, res)=>{
    await Product.findOneAndUpdate({_id: req.params.productID},
        {
            $set: {
                description: req.body.description,
                name: req.body.name,
                price: req.body.price,
            },
        }, {new: true}).then(
        (err, Product)=>{
            if(err){
                res.send(err);
                // res.status(400).json({message: "False"});
                console.log("error")
            }else {
                res.status(200).json(Product);

            }
        }
    )
});
product.get("/product/:productID", auth, async (req, res)=>{

    try {
        const product = await Product.findById(req.params.productID).populate(['user_id', 'category_id']);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const productName = product.name || 'No Name';
        const productPrice = product.price || 0; // Use a suitable default price
        const name = product.user_id ? product.user_id.first_name+' '+product.user_id.last_name : 'Unknown User';
        const email = product.user_id.email;
        const category_name = product.category_id ? product.category_id.name : '';

        res.json({
            data: {
                name: productName,
                price: productPrice,
                addedBy: {name: name, email: email},
                category: {name: category_name}
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})
product.delete("/product/:productID", auth, (req, res)=>{
    Product.deleteOne({_id: req.params.productID})
        .then(()=>res.json({message: "Product Deleted"}))
        .catch((err)=>res.send(err));

});

module.exports = product;