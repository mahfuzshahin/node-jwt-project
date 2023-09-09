const mongoose = require("mongoose")

const CategorySchema = new mongoose.Schema({
    name: {type: String, default:null},
    type: {type: String, default: null},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref:'user'}
})
module.exports = mongoose.model("category", CategorySchema)