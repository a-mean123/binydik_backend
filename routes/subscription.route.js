const express = require('express');

const router = express.Router();
const {
    createFreeSubscription,
    createPaidSubscription,
    listSubscriptions,
    mySubscriptions,
    isMine,
    courseSubscriptions,
    getSubscriptionById,
    deleteSubscription,
    updateSubscription,
    archiveListSubscriptions,
    restoreSubscription,
    archiveSubscription,
    payments
} = require('../controllers/subscription.controller');

const { verifyTokenAdminAndUser, verifyTokenUser, verifyTokenAdmin } = require('../config/middlware/auth');

router.post('/createfree', verifyTokenAdminAndUser , createFreeSubscription);
router.post('/createpaid', verifyTokenUser , createPaidSubscription);
router.get('/payments', payments);

router.get('/all/:page', verifyTokenAdmin , listSubscriptions);
router.get('/mysubscriptions/:id', verifyTokenAdminAndUser , mySubscriptions);
router.get('/ismine/:idUser/:idCourse', verifyTokenAdminAndUser , isMine);
router.get('/coursesubscriptions/:id', verifyTokenAdmin , courseSubscriptions);
router.get('/byid/:id', verifyTokenAdmin , getSubscriptionById);
router.delete('/delete/:id', verifyTokenAdminAndUser , deleteSubscription);
router.put('/update/:id', verifyTokenAdmin , updateSubscription);
router.delete('/archive/:id', verifyTokenAdmin , archiveSubscription);
router.put('/restore/:id', verifyTokenAdmin , restoreSubscription);
router.get('/archivelist', verifyTokenAdmin , archiveListSubscriptions);



module.exports = router;