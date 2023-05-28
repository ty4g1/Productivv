const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const validator = require('validator');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

//static signup method
userSchema.statics.signup = async function(email, pass) {
    //validation
    if (!(email && pass)) {
        throw Error("All fields mus be filled");
    }
    if (!validator.isEmail(email)) {
        throw Error("Please enter a valid e-mail");
    }
    //must include special char,alpha-num, uppercase, lowercase, min 8 characters
    if (!validator.isStrongPassword(pass)) {    
        throw Error('Please enter a stronger password');
    }             
    const exists = await this.findOne({email: email});
    if (exists) {
        throw Error('Email already in use');
    }
    //hashing password
    const salt = await bcrypt.genSalt(10);   //append to end of password so idenctical passwords have different hashes
    const hash = await bcrypt.hash(pass, salt);

    const user = await this.create({email, password: hash});
    return user;
}

//static login method
userSchema.statics.login = async function(email, pass) {
    if (!(email && pass)) {
        throw Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
        throw Error("Please enter a valid e-mail");
    }

    const user = await this.findOne({email: email});
    if (!user) {
        throw Error('Incorrect email or password');
    }

    const match = await bcrypt.compare(pass, user.password);
    if (!match) {
        throw Error('Incorrect email or password');
    }
    return user;
}

module.exports = mongoose.model('User', userSchema);