const express = require('express');

const router = express.Router();
const {
    createFacilitie,
    getAllFacilities,
    getFacilitieById,
    deleteFacilitie,
    updateFacilitie,
    getFacilitiesByMainCategorie,
    archiveListFacilities,
    archiveFacilitie,
    restoreFacilitie
} = require('../controllers/facilities.controller');

const { verifyTokenAdmin } = require('../config/middlware/auth');

router.post('/create', verifyTokenAdmin , createFacilitie);
router.get('/all', getAllFacilities);
router.get('/byid/:id', verifyTokenAdmin , getFacilitieById);
router.get('/bymaincategorie/:main', getFacilitiesByMainCategorie);
router.delete('/delete/:id', verifyTokenAdmin , deleteFacilitie);
router.put('/update/:id', verifyTokenAdmin , updateFacilitie);
router.delete('/archive/:id', verifyTokenAdmin , archiveFacilitie);
router.put('/restore/:id', verifyTokenAdmin , restoreFacilitie);
router.get('/archivelist', verifyTokenAdmin , archiveListFacilities);


module.exports = router;