const mongoose = require('mongoose');

const LogsSchema = new mongoose.Schema({

    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required: true,
        index: true
    },

    lab : {
        type: mongoose.Schema.Types.ObjectId ,
        ref : 'Lab' ,
        required : true,
        index: true       
    },

    flags : [{
        type : String
    }],

    challPort : {
        type : Number,
        index: true
    },

    challIp : {
        type : String,
        index: true
    },

    timerPort : {
        type : Number
    },

    status : {
        type : String,
        enum: ['deploying','deployed'],
        default: 'deploying',
        index: true
    },

    startDate : {
        type : Date,
        default : new Date()
    },

    endDate : {
        type : Date,
        default : new Date(Date.now() + ( 3600 * 1000)),
        index: true
    }
})

module.exports = mongoose.model('Lab_Log',LogsSchema);