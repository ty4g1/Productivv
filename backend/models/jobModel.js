const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//defining the schema for job
const jobSchema = new Schema({
    chat_id: { 
        type: String,
        required: true
    },
    job: {
        type: Object,
        required: true
    }
}, {timestamps: true});

//model that allows us to ineract with collection
module.exports = mongoose.model('Job', jobSchema);

