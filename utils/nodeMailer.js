const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
const sendMail = async (to, subject, html_body)=>{
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILER_AUTH_EMAIL, // generated ethereal user
            pass: process.env.NODEMAILER_AUTH_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'noreply@gmail.com', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: html_body, // html body
    });
}

module.exports = {sendMail}