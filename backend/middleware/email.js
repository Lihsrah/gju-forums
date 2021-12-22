require('dotenv').config()
const nodemailer = require('nodemailer');

const sendemail = async (email, subject, htmltext) => {
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: provess.env.PASS
        }
    });

    let mailDetails = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: htmltext
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
}
module.exports = sendemail