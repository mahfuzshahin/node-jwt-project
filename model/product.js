const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name:{type: String, default: null},
    price:{type: Number, default: null},
    description:{type: String, default: null},
    user_id:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    category_id:{type: mongoose.Schema.Types.ObjectId, ref: 'category'},
});
module.exports = mongoose.model("products", productSchema)