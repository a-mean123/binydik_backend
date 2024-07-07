// const express = require('express');
// const router = express.Router();

// const {
//     viewSite,
//     getCounters,
//     getSpecificCourseVisitChartData,
//     getAllCourseVisitChartData,
//     getSpecificArticleVisitChartData,
//     getAllArticleVisitChartData,
//     getSubscriptionsChartData
// } = require('../controllers/statistics.controller');

// const { verifyTokenAdmin } = require('../config/middlware/auth');

// router.post('/view/:id', viewSite);
// router.get('/counters', verifyTokenAdmin , getCounters);
// router.get('/specificcoursechartdata/:id/:y', verifyTokenAdmin , getSpecificCourseVisitChartData);
// router.get('/specificarticlechartdata/:id/:y', verifyTokenAdmin , getSpecificArticleVisitChartData);
// router.get('/allarticlechartdata/:y', verifyTokenAdmin , getAllArticleVisitChartData);
// router.get('/allcoursechartdata/:y', verifyTokenAdmin , getAllCourseVisitChartData);
// router.get('/subscriptionchartdata/:y', verifyTokenAdmin , getSubscriptionsChartData);

// module.exports = router;