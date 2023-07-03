const nodemailer = require('nodemailer');
require('dotenv').config();

//setup transporter
let transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

//verfiy connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages');
    }
}
);

const sendEmail = (email, subject, text) => {
    let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: text
    };
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent');
        }
    });
}

module.exports = sendEmail;
