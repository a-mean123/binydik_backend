const Contact = require('../models/contact.model');
const { notifyUser, notifyAdmin, sendEmail } = require('./mailing.controller');


const sendContact = async (req, res) => {

    try {

        let contact = new Contact(req.body);
        let result = await contact.save();

        let emailObject = {
            destination: contact.email,
            subject: contact.subject,
            content: `<h1>New Message : ${contact.message}</h1>`
        }
        notifyAdmin(emailObject, res);
        emailObject.destination = contact.email;
        emailObject.subject = 'Notification';
        emailObject.content = `<h1>Bien recu</h1>`;
        notifyUser(emailObject, res);
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const sendResponseOnEmail = async (req, res) => {

    try {
        
        let emailObject = {
            destination: req.body.email,
            subject: req.body.subject, // to be replaced by another subject
            content: `<h1>response: ${req.body.message}</h1>`
        }
        await sendEmail(emailObject, res);
        res.status(200).send({message: 'sent'});

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getAllContact = async (req, res) => {

    try {
        let { page } = req.params;
        let startIndex = (page-1)*10;
        let result = await Contact.aggregate([
            { $sort: { eid: 1, modifyDate: 1 } },
            { $skip: startIndex },
            { $limit: 10 }
        ])

        res.status(200).json({
            contacts: result,
            page: page,
            total: await Contact.countDocuments()
        });

    } catch (error) {

        res.status(400).json({ error: error.message });
    }

}

const getContactById = async (req, res) => {

    try {

        let id = req.params.id;
        let result = await Contact.findById({ _id: id });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const deleteContact = async (req, res) => {

    try {

        let id = req.params.id;
        let result = await Contact.findByIdAndDelete({ _id: id });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}



module.exports = {
    sendContact,
    getAllContact,
    getContactById,
    deleteContact,
    sendResponseOnEmail
}