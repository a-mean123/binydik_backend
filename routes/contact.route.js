const express = require('express');
const router = express.Router();

const {
    sendContact,
    getAllContact,
    getContactById,
    deleteContact,
    sendResponseOnEmail
} = require('../controllers/contact.controller');
const { verifyTokenAdmin } = require('../config/middlware/auth');


router.post('/send', sendContact);
router.get('/all/:page', verifyTokenAdmin , getAllContact);
router.get('/byid/:id', verifyTokenAdmin , getContactById);
router.delete('/delete/:id', verifyTokenAdmin , deleteContact);
router.post('/sendresponse', verifyTokenAdmin , sendResponseOnEmail);


module.exports = router;