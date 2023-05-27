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
    time: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
}, {timestamps: true});

//model that allows us to ineract with collection
module.exports = mongoose.model('Task', taskSchema);    
