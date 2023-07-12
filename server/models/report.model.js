const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    user_name : {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    lab_name : {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    group_name : {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    submissions : {
        type : Number,
        required : true,
        default : 0,
        index : true
    },

    score : {
        type : Number,
        required : true,
        default : -1,
        index : true,
    }
})

module.exports = mongoose.model('Report',ReportSchema);