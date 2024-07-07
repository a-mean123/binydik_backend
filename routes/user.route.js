const express = require('express');
const router = express.Router();



const { testProtectionUser, logoutUser, verifyTokenAdminAndUser, verifyTokenAdmin, verifyTokenUser,
    googleAuthCallback  } = require('../config/middlware/auth');

const multer = require('multer');

let fileName = '';
const diskStorage = multer.diskStorage({
    destination: './public/user',
    filename: (req, file, cb) => {
        fileName = Date.now() + '.' + file.mimetype.split('/')[1];
        cb(null, fileName);
    }
})

const upload = multer({ storage: diskStorage });


const userController = require('../controllers/user.controller');

// Register routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Google OAuth routes
router.get('/auth/google', userController.googleAuth);
router.get('/auth/google/callback', userController.googleAuthCallback);

// get my data
router.post('/token', userController.token);
router.get('/me', verifyTokenUser, userController.getUser);

router.put('/update/:id', verifyTokenAdminAndUser , upload.single('image'), (req, res) => {
    update(req, res, fileName);
});



router.get('/page/:page', verifyTokenAdmin , userController.page);
router.get('/byid/:id', verifyTokenAdminAndUser , userController.byId);
router.delete('/delete/:id', verifyTokenAdminAndUser , userController.del);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);

router.delete('/archive/:id', verifyTokenAdmin , userController.archiveUser);
router.put('/restore/:id', verifyTokenAdmin , userController.restoreUser);
router.get('/archivelist', verifyTokenAdmin , userController.archiveListUser);

router.get('/testprotection', verifyTokenUser , testProtectionUser);
router.post('/logout', logoutUser)

module.exports = router;