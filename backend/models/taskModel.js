const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//defining the schema for task 
const taskSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    recurr_id: {
        type: String
    },
    color: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    },
    tags: {
        type: Array,
        default: []
    },
    priority: {
        type: Number,
        default: 50
    }
}, {timestamps: true});

//model that allows us to ineract with collection
module.exports = mongoose.model('Task', taskSchema);    
