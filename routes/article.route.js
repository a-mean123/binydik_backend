const express = require('express');
const router = express.Router();
const {
    createArticle,
    existSlog,
    getPageArticles,
    getArticleByCategorie,
    getArticleById,
    getArticleBySlog,
    deleteArticle,
    updateArticle,
    searchArticles,
    archiveListArticles,
    restoreArticle,
    archiveArticle,
    featuredArticle,
    getFeaturedArticles,
    getArticlesTitles,
    getPageArticlesForClientSide
} = require('../controllers/article.controller');

const { verifyTokenAdmin } = require('../config/middlware/auth');

const multer = require('multer');

let fileName = '';
const diskStorage = multer.diskStorage({
    destination: './public/article',
    filename: (req, file, cb) => {
        fileName = Date.now() + '.' + file.mimetype.split('/')[1];
        cb(null, fileName);
    }
})

const upload = multer({ storage: diskStorage });

router.post('/create', verifyTokenAdmin, upload.single('image'), (req, res) => {
    createArticle(req, res, fileName);
    fileName="";
});

router.put('/update/:id', verifyTokenAdmin, upload.single('image'), (req, res) => {
    updateArticle(req, res, fileName);
    fileName="";
});

router.get('/exist/:slog/:id', verifyTokenAdmin, existSlog);
router.get('/pagearticle/:page', verifyTokenAdmin, getPageArticles);
router.get('/pagearticleclientside/:page/:categorie', getPageArticlesForClientSide);
router.get('/articletitles', getArticlesTitles);
router.get('/bycategorie/:cat', getArticleByCategorie);
router.get('/byid/:id', verifyTokenAdmin, getArticleById);
router.get('/byslog/:slog', getArticleBySlog);
router.delete('/delete/:id', verifyTokenAdmin, deleteArticle);


router.get('/search/:keyword', searchArticles);

router.get('/featuredlist', getFeaturedArticles);
router.put('/featured/:id', verifyTokenAdmin, featuredArticle);



router.delete('/archive/:id', verifyTokenAdmin, archiveArticle);
router.put('/restore/:id', verifyTokenAdmin, restoreArticle);
router.get('/archivelist', verifyTokenAdmin, archiveListArticles);

module.exports = router;