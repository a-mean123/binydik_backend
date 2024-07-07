// const Article = require('../models/article.model');
// const Contact = require('../models/contact.model');
// const Commerce = require('../models/commerce.model');
// const User = require('../models/user.model');
// const Subscription = require('../models/subscription.model');



// const startCounting = async (req, res) => {

//     try {

//         const visit = new Visit();
//         await visit.save();
//         console.log('visit counting created , you can start counting now');

//     } catch (error) {
//         console.log(error.message);
//     }

// }

// const viewSite = async (req, res) => {

//     try {

//         const { ipAddress } = req.body;

//         const visit = await Visit.findOne();

//         if (!visit) {
//             return res.status(404).json({ message: 'Visit not found' });
//         }

//         // Check if the IP address has already viewed the Commerce
//         const existingView = Commerce.visits.find(v => v.ipAddress === ipAddress);

//         if (!existingView) {
//             visit.visits.push({
//                 ipAddress,
//                 date: new Date()
//             });


//             await visit.save();

//             return res.status(200).json({ message: 'View count updated successfully' });
//         } else {
//             return res.status(400).json({ message: 'IP address already viewed the website' });
//         }

//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }

// }

// const getCounters = async (req, res) => {

//     try {

//         let article = await Article.find({ archived: false }).count();
//         let contact = await Contact.find().count();
//         let Commerce = await Commerce.find({ archived: false }).count();
//         let user = await User.find({ archived: false }).count();
//         let subscription = await Subscription.find({ archived: false }).count();
//         let depot = await Depot.find().count();
//         let quizRep = await QuizRep.find().count();
//         let newsletter = await Newsletter.find().count();
//         let visits = await Visit.find();


//         let result = {
//             article: article,
//             contact: contact,
//             Commerce: Commerce,
//             user: user,
//             subscription: subscription,
//             depot: depot,
//             quizRep: quizRep,
//             newsletter: newsletter,
//             visits: visits.length
//         }

//         res.status(200).send(result);

//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }

// }



// const formatDateToYYYYMMDD = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');

//     return `${year}-${month}-${day}`;
// }


// const getSpecificCommerceVisitChartData = async (req, res) => {

//     try {

//         let { y, id } = req.params;
//         let Commerce = await Commerce.findById({ _id: id });

//         if (!Commerce) {
//             return res.status(404).json({ message: 'Commerce not found' });
//         }

//         let views = Commerce.views;

//         let [j, f, m, a, ma, ju, jui, ao, s, o, n, de] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


//         for (let i = 0; i < views.length; i++) {
//             let d = formatDateToYYYYMMDD(views[i].date);

//             let date = d.substring(5, 2);
//             let year = d.substring(0, 4);
//             date === '01' && year == y ? j++ :
//                 date === '02' && year == y ? f++ :
//                     date === '03' && year == y ? m++ :
//                         date === '04' && year == y ? a++ :
//                             date === '05' && year == y ? ma++ :
//                                 date === '06' && year == y ? ju++ :
//                                     date === '07' && year == y ? jui++ :
//                                         date === '08' && year == y ? ao++ :
//                                             date === '09' && year == y ? s++ :
//                                                 date === '10' && year == y ? o++ :
//                                                     date === '11' && year == y ? n++ :
//                                                         date === '12' && year == y ? de++ : null

//         }

//         let data = [j, f, m, a, ma, ju, jui, ao, s, o, n, de];

//         let result = {
//             data: data
//         }

//         res.status(200).send(result);

//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }

// }

// const getAllCommerceVisitChartData = async (req, res) => {

//     try {

//         let { y } = req.params;
//         let Commerces = await Commerce.find({ archived: false });

//         if (!Commerces) {
//             return res.status(404).json({ message: 'Commerces not found' });
//         }

//         let views = [];

//         for (let Commerce of Commerces) {
//             views = [...views, ...Commerce.views];
//         }

//         let [j, f, m, a, ma, ju, jui, ao, s, o, n, de] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


//         for (let i = 0; i < views.length; i++) {
//             let d = formatDateToYYYYMMDD(views[i].date);

//             let date = d.substring(5, 2);
//             let year = d.substring(0, 4);
//             date === '01' && year == y ? j++ :
//                 date === '02' && year == y ? f++ :
//                     date === '03' && year == y ? m++ :
//                         date === '04' && year == y ? a++ :
//                             date === '05' && year == y ? ma++ :
//                                 date === '06' && year == y ? ju++ :
//                                     date === '07' && year == y ? jui++ :
//                                         date === '08' && year == y ? ao++ :
//                                             date === '09' && year == y ? s++ :
//                                                 date === '10' && year == y ? o++ :
//                                                     date === '11' && year == y ? n++ :
//                                                         date === '12' && year == y ? de++ : null

//         }

//         let data = [j, f, m, a, ma, ju, jui, ao, s, o, n, de];

//         let result = {
//             data: data
//         }

//         res.status(200).send(result);

//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }

// }

// const getSpecificArticleVisitChartData = async (req, res) => {

//     try {

//         let { y, id } = req.params;
//         let article = await Article.findById({ _id: id });

//         if (!article) {
//             return res.status(404).json({ message: 'Article not found' });
//         }

//         let views = article.views;

//         let [j, f, m, a, ma, ju, jui, ao, s, o, n, de] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


//         for (let i = 0; i < views.length; i++) {
//             let d = formatDateToYYYYMMDD(views[i].date);

//             let date = d.substring(5, 2);
//             let year = d.substring(0, 4);
//             date === '01' && year == y ? j++ :
//                 date === '02' && year == y ? f++ :
//                     date === '03' && year == y ? m++ :
//                         date === '04' && year == y ? a++ :
//                             date === '05' && year == y ? ma++ :
//                                 date === '06' && year == y ? ju++ :
//                                     date === '07' && year == y ? jui++ :
//                                         date === '08' && year == y ? ao++ :
//                                             date === '09' && year == y ? s++ :
//                                                 date === '10' && year == y ? o++ :
//                                                     date === '11' && year == y ? n++ :
//                                                         date === '12' && year == y ? de++ : null

//         }

//         let data = [j, f, m, a, ma, ju, jui, ao, s, o, n, de];

//         let result = {
//             data: data
//         }

//         res.status(200).send(result);

//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }

// }

// const getAllArticleVisitChartData = async (req, res) => {

//     try {

//         let { y } = req.params;
//         let articles = await Article.find({ archived: false });

//         if (!articles) {
//             return res.status(404).json({ message: 'Articles not found' });
//         }

//         let views = [];

//         for (let article of articles) {
//             views = [...views, ...article.views];
//         }

//         let [j, f, m, a, ma, ju, jui, ao, s, o, n, de] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


//         for (let i = 0; i < views.length; i++) {
//             let d = formatDateToYYYYMMDD(views[i].date);

//             let date = d.substring(5, 2);
//             let year = d.substring(0, 4);
//             date === '01' && year == y ? j++ :
//                 date === '02' && year == y ? f++ :
//                     date === '03' && year == y ? m++ :
//                         date === '04' && year == y ? a++ :
//                             date === '05' && year == y ? ma++ :
//                                 date === '06' && year == y ? ju++ :
//                                     date === '07' && year == y ? jui++ :
//                                         date === '08' && year == y ? ao++ :
//                                             date === '09' && year == y ? s++ :
//                                                 date === '10' && year == y ? o++ :
//                                                     date === '11' && year == y ? n++ :
//                                                         date === '12' && year == y ? de++ : null

//         }

//         let data = [j, f, m, a, ma, ju, jui, ao, s, o, n, de];

//         let result = {
//             data: data
//         }

//         res.status(200).send(result);

//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }

// }

// const getSubscriptionsChartData = async (req, res) => {

//     try {

//         let { y } = req.params;
//         let subscriptions = await Subscription.find({ archived: false });

//         if (!subscriptions) {
//             return res.status(404).json({ message: 'Subscriptions not found' });
//         }

//         let [j, f, m, a, ma, ju, jui, ao, s, o, n, de] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


//         for (let i = 0; i < subscriptions.length; i++) {
//             let d = formatDateToYYYYMMDD(subscriptions[i].date);

//             let date = d.substring(5, 2);
//             let year = d.substring(0, 4);
//             date === '01' && year == y ? j++ :
//                 date === '02' && year == y ? f++ :
//                     date === '03' && year == y ? m++ :
//                         date === '04' && year == y ? a++ :
//                             date === '05' && year == y ? ma++ :
//                                 date === '06' && year == y ? ju++ :
//                                     date === '07' && year == y ? jui++ :
//                                         date === '08' && year == y ? ao++ :
//                                             date === '09' && year == y ? s++ :
//                                                 date === '10' && year == y ? o++ :
//                                                     date === '11' && year == y ? n++ :
//                                                         date === '12' && year == y ? de++ : null

//         }

//         let data = [j, f, m, a, ma, ju, jui, ao, s, o, n, de];

//         let result = {
//             data: data
//         }

//         res.status(200).send(result);

//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }

// }

// module.exports = {
//     startCounting,
//     viewSite,
//     getCounters,
//     getSpecificCommerceVisitChartData,
//     getAllCommerceVisitChartData,
//     getSpecificArticleVisitChartData,
//     getAllArticleVisitChartData,
//     getSubscriptionsChartData
// }

