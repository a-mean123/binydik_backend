const Subscription = require('../models/subscription.model');
const User = require('../models/user.model');
const Course = require('../models/commerce.model');
const Coupon = require('../models/coupon.model');
const mongoose = require('mongoose');
const axios = require('axios');
const cron = require('node-cron');





const deleteIncompleteOrders = async () => {
    try {
        // Define your criteria for incomplete orders
        const incompleteCriteria = {
            status: 'in progress',
            date: { $lt: new Date(Date.now() - 10 * 60 * 1000) } // Example: older than 10 minutes
        };

        // Delete incomplete orders based on the criteria
        const result = await Subscription.deleteMany(incompleteCriteria);

        console.log(`${result.deletedCount} incomplete orders deleted successfully.`);
    } catch (err) {
        console.error('Error deleting incomplete orders:', err);
    }
}


// Schedule the function to run every 10 minutes
cron.schedule('*/20 * * * *', () => {
    deleteIncompleteOrders();
});

// Keep the script running
process.stdin.resume();



const createSubscriptionByAdmin = async (req, res) => {

    try {
        let course = await Course.findById({ _id: req.body.idCourse });

        let subscription = new Subscription(req.body);
        subscription.status = 'passed';
        const savedSubscription = await subscription.save();
        res.status(200).send(savedSubscription)


    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const createFreeSubscription = async (req, res) => {

    try {
        let course = await Course.findById({ _id: req.body.idCourse });
        if (course.payant == false) {
            let subscription = new Subscription(req.body);
            subscription.status = 'passed';
            subscription.price = 0;
            const savedSubscription = await subscription.save();
            res.status(200).send(savedSubscription)
        } else {
            res.status(400).json({ error: 'this is not a free course' });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const createPaidSubscription = async (req, res) => {

    let { idUser, idCourse, code } = req.body;

    let course = await Course.findById({ _id: idCourse });

    if (code) {
        let coupon = await Coupon.findOne({ code, idCourse });

        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        const currentDate = new Date();
        if (currentDate > coupon.expirationDate) {
            return res.status(400).json({ error: 'Coupon has expired' });
        }

        course.price -= course.price * coupon.discount / 100;
        course.price = parseFloat((Math.ceil(course.price * 10) / 10).toFixed(1));
    }

    if (!course.payant) {
        createFreeSubscription(req, res);
    } else {
        let user = await User.findById({ _id: idUser });
        let subscription = new Subscription({ idUser, idCourse });
        subscription.status = 'in progress';
        subscription.price = course.price;
        savedSubscription = await subscription.save();
        let orderDetails = {
            "receiverWalletId": "65cb39b5d99a3c4e39febf55",
            "token": "TND",
            "amount": course.price * 1000,
            "type": "immediate",
            "description": "payment description",
            "acceptedPaymentMethods": [
                "wallet",
                "bank_card",
                "e-DINAR"
            ],
            "lifespan": 20,
            "checkoutForm": false,
            "addPaymentFeesToAmount": false,
            "firstName": user.fullname,
            // "lastName": "Doe",
            "phoneNumber": user.tel,
            "email": user.email,
            "orderId": savedSubscription._id,
            "webhook": "https://api.yolio.tn/subscription/payments",
            "silentWebhook": false,
            "successUrl": "https://yolio.tn/success",
            "failUrl": "https://yolio.tn/failed",
            "theme": "light"
        }

        axios.post(
            'https://api.konnect.network/api/v2/payments/init-payment',
            orderDetails,
            { headers: { 'x-api-key': '65cb39b5d99a3c4e39febf51:soItoZxsFX3yur7GFz8I2' } }
        ).then(response => {
            res.status(200).send({ orderDetails: response.data });
        })
            .catch(error => {
                res.status(400).json({ error: error.message });
            });

    }

}


const payments = async (req, res) => {
    console.log(req);
    const paymentRef = req.query.payment_ref;
    console.log('here', paymentRef);
    axios.get('https://api.konnect.network/api/v2/payments/' + paymentRef).then(async (response) => {
        console.log('res', response);
        if (response.data.payment.status == 'completed') {
            const subscription = await Subscription.findByIdAndUpdate({ _id: response.data.payment.orderId }, { status: 'passed' });
            res.redirect(301, 'https://yolio.tn/success');
        } else {
            const subscription = await Subscription.findByIdAndDelete({ _id: response.data.payment.orderId });
            res.redirect(301, 'https://yolio.tn/failed');
        }


    })
        .catch(error => {
            console.log(error);
        });
}



const listSubscriptions = async (req, res) => {

    try {
        let { page } = req.params;
        let startIndex = (page - 1) * 10;
        let result = await Subscription.aggregate([
            { $match: { archived: false } },
            { $sort: { eid: 1, modifyDate: 1 } },
            { $skip: startIndex },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: 'idUser',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'idCourse',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            {
                $project: {

                    '_id': 1,
                    'date': 1,
                    'status': 1,
                    'price': 1,
                    'idCourse': 1,
                    'idUser': 1,
                    'course.title': 1,
                    'user.fullname': 1

                }
            }
        ])

        res.status(200).json({
            subscriptions: result,
            page: page,
            total: await Subscription.countDocuments({ archived: false })
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const mySubscriptions = async (req, res) => {

    try {

        const { id } = req.params;
        const result = await Subscription.aggregate([
            { $match: { idUser: new mongoose.Types.ObjectId(id), archived: false, status: 'passed' } },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'idCourse',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            {
                $project: {

                    '_id': 1,
                    'date': 1,
                    'status': 1,
                    'price': 1,
                    'idCourse': 1,
                    'idUser': 1,
                    'course.title': 1,
                    'course.description': 1,
                    'course.image': 1,
                    'course.slog': 1,

                }
            }

        ])

        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}

const courseSubscriptions = async (req, res) => {

    try {

        const { id } = req.params;
        const result = await Subscription.aggregate([
            { $match: { idCourse: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'idUser',
                    foreignField: '_id',
                    as: 'users'
                }
            }

        ])

        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}

const isMine = async (req, res) => {

    try {

        let { idUser, idCourse } = req.params;
        let subscription = await Subscription.findOne({ idUser, idCourse, archived: false, status: 'passed' });
        console.log(subscription);
        if (!subscription) {
            res.status(200).json({ isMine: false })
        } else {
            res.status(200).json({ isMine: true })
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const getSubscriptionById = async (req, res) => {

    try {

        let { id } = req.params;
        let subscription = await Subscription.findOne({ _id: id, archived: false });
        let user = await User.findOne({ _id: subscription.idUser });

        user.password = '';

        let course = await Course.find({ _id: subscription.idUser });


        res.status(200).json({
            subscription: subscription,
            course: course,
            user: user
        })

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const deleteSubscription = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await Subscription.findByIdAndDelete({ _id: id });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const updateSubscription = async (req, res) => {

    try {

        let { id } = req.params;
        let data = req.body;
        let result = await Subscription.findByIdAndUpdate({ _id: id }, data);
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const archiveSubscription = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await Subscription.findByIdAndUpdate({ _id: id }, { archived: true });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const restoreSubscription = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await Subscription.findByIdAndUpdate({ _id: id }, { archived: false });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const archiveListSubscriptions = async (req, res) => {

    try {

        let result = await Subscription.aggregate([
            { $match: { archived: true } },
            { $sort: { eid: 1, modifyDate: 1 } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'idUser',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'idCourse',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            {
                $project: {

                    '_id': 1,
                    'date': 1,
                    'status': 1,
                    'price': 1,
                    'idCourse': 1,
                    'idUser': 1,
                    'course.title': 1,
                    'user.fullname': 1

                }
            }
        ])
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

module.exports = {
    createSubscriptionByAdmin,
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
}