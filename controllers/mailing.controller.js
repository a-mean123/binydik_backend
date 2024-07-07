const nodemailer = require('nodemailer');

const notifyUser = async (emailObject, res) => {
    try {
       
        sendEmail(emailObject, res);

    } catch (error) {
        console.log(error);
    }
}

const notifyAdmin = async (emailObject, res) => {

    try {
        emailObject.destination = process.env.EMAIL;
        sendEmail(emailObject, res);

    } catch (error) {
        console.log(error);
    }

}



const sendEmail = async (emailObject, res) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,

        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
        },
    });

    let mailOptions = {
        from: {
            name: 'YOLIO CAREER',
            address: process.env.EMAIL
        },

        to: emailObject.destination,
        subject: emailObject.subject,
        html: emailObject.content
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } 
    });

}


module.exports = {
    notifyAdmin,
    notifyUser,
    sendEmail
}