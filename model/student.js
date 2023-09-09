const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    st_roll: {type: Number, default: null},
    user_id:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
})
module.exports = mongoose.model("student", StudentSchema)