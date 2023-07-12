const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({

    name : {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true
    },

    description : {
        type: String,
        required: true,
        trim: true,
        unique: true,
        min: 5,
        max: 400
    },

    flagable : {
        type: Boolean,
        required: true,
        default: false
    },

    flags : {
        type : Number,
        default : 0,
        max : 3
    },

    difficulty : {
        type : String,
        enum: ['easy','medium','hard'],
        default: 'medium'
    }

},{timestamps : true})


module.exports = mongoose.model('Lab' , LabSchema);
