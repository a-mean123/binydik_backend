const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const session = require('express-session');

require('dotenv').config();
require('./config/connection');



// admin signup function
const { createAdminAccount } = require('./controllers/user.controller');
const port = 3626;

// import routes

const articleApi = require('./routes/article.route');
const categorieApi = require('./routes/categorie.route');
const maincategorieApi = require('./routes/maincategorie.route');
const subcategorieApi = require('./routes/subcategorie.route');
const facilitieApi = require('./routes/facilitie.route');
const contactApi = require('./routes/contact.route');

const userApi = require('./routes/user.route');

const subscriptionApi = require('./routes/subscription.route');
const commerceApi = require('./routes/commerce.route');
const reviewApi = require('./routes/review.route');
// const statisticsApi = require('./routes/statistics.route');
const testimonialApi = require('./routes/testimonial.route');

const couponApi = require('./routes/coupon.route');
const adsRoute = require('./routes/ads.route');
const wishlistRoute = require('./routes/wishlist.route');

const { generateAds } = require('./controllers/ads.controller');


const app = express();
app.use(express.json());
app.use(cors());

// session config

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => res.json({ message: 'server work!' }))


// use routes

app.use('/article', articleApi);
app.use('/categorie', categorieApi);
app.use('/maincategorie', maincategorieApi);
app.use('/subcategorie', subcategorieApi);
app.use('/facilitie', facilitieApi);
app.use('/contact', contactApi);
app.use('/user', userApi);

app.use('/subscription', subscriptionApi);
app.use('/commerce', commerceApi);
app.use('/review', reviewApi);

app.use('/testimonial', testimonialApi);
// app.use('/statistics', statisticsApi);

app.use('/coupon', couponApi);
app.use('/ads', adsRoute);
app.use('/wishlist', wishlistRoute);

app.use('/article', express.static('./public/article') )
app.use('/ads', express.static('./public/ads') )
app.use('/commerce', express.static('./public/commerce') )
app.use('/user', express.static('./public/user') )


app.listen(port, () => {
    console.log(`server listen on http://127.0.0.1:${port}`);
    createAdminAccount();
    generateAds();
})
