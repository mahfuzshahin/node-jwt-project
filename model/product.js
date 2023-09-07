const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name:{type: String, default: null},
    price:{type: Number, default: null},
    description:{type: String, default: null},
    user_id:{type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
});
module.exports = mongoose.model("products", productSchema)