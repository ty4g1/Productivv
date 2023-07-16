const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const validator = require('validator');
const sendEmail = require('../services/sendEmail');

//import verification model
const Verification = require('./verificationModel');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tele_id: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    points: {
        type: Number,
        default: 0
    },
    timezone: {
        type: String,
        default: "Etc/GMT+12"
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
    //send verification email
    console.log(email);
    Verification.sendVerification(email);

    //hashing password
    const salt = await bcrypt.genSalt(10);   //append to end of password so idenctical passwords have different hashes
    const hash = await bcrypt.hash(pass, salt);

    const user = await this.create({email, password: hash, username: email.split('@')[0]});
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

    if (!user.verified) {   //if user is not verified   
        throw Error('Please verify your email');
    }

    const match = await bcrypt.compare(pass, user.password);
    if (!match) {
        throw Error('Incorrect email or password');
    }
    return user;
}

userSchema.statics.find = async function(tele_id) {
    if (!tele_id) {
        throw Error(`All fields must be filled ${tele_id}`);
    }
    const user = await this.findOne({tele_id: tele_id});
    if (!user) {
        throw Error('Incorrect telegram username');
    }
    return user;
}

userSchema.statics.profile = async function(email) {
    if (!email) {
        throw Error(`All fields must be filled`);
    }
    const user = await this.findOne({email: email});
    if (!user) {
        throw Error('Incorrect email');
    }
    return user;
}

userSchema.statics.updateProfile = async function(body) {
    if (!body) {
        throw Error(`All fields must be filled`);
    }
    const user = await this.findOneAndUpdate({email: body.email}, {username: body.username, tele_id: body.tele_id});
    if (!user) {
        throw Error('Incorrect email');
    }
    return user;
}

userSchema.statics.updatePoints = async function(body) {
    if (!body) {
        throw Error(`All fields must be filled`);
    }
    const user = await this.findOne({email: body.email});
    if (!user) {
        throw Error('Incorrect email');
    }
    const points = user.points + body.points;
    const upd_user = await this.findOneAndUpdate({email: body.email}, {points: points});
    return upd_user;
}

userSchema.statics.deleteProfile = async function(id) {
    if (!id) {
        throw Error(`All fields must be filled`);
    }
    const delRecords = await this.deleteMany({_id: new mongoose.Types.ObjectId(id)});
    if (!delRecords) {
        throw Error('Incorrect user id');
    }
    return delRecords;
}

userSchema.statics.sendResetMail = async function(email, token) {
    if (!email) {
        throw Error(`All fields must be filled`);
    }
    const user = this.findOne({email: email});
    if (!user) {
        throw Error('Incorrect email');
    }
    const link = `http://productivv.netlify.app/reset/${token}`;
    sendEmail(email, "Reset password link" ,`<p> Click the link below to reset your password </p><br><p>${link}</p>`);
    return user;
}

//authenticate google login
userSchema.statics.googleLogin = async function(email) {
    if (!email) {
        throw Error(`All fields must be filled`);
    }
    const user = await this.findOne({email: email});
    if (!user) {
        throw Error('Incorrect email');
    }
    return user;
}

//google signup
userSchema.statics.googleSignup = async function(email, pass) {
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

    const user = await this.create({email, password: hash, username: email.split('@')[0], verified: true});
    return user;
}



module.exports = mongoose.model('User', userSchema);