const Coupon = require('../models/coupon.model');

const generateCoupon = async (req, res) => {
    try {
        let coupon = new Coupon(req.body);
        let result = await coupon.save();
        res.status(200).send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const listCoupon = async (req, res) => {
    try {
        let result = await Coupon.aggregate([
            {
                $lookup: {
                    from: 'courses',
                    localField: 'idCourse',
                    foreignField: '_id',
                    as: 'course'
                }
            }
        ])
        let coupons = [];

        for(let coupon of result){
            let coup = {
                ...coupon,
                course: coupon.course[0].title
            }
            coupons.push(coup)
        }
        res.status(200).send(coupons);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const byIdCoupon = async (req, res) => {
    try {
        let result = await Coupon.findOne({ _id: req.params.id });
        res.status(200).send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const byIdCourse = async (req, res) => {
    try {
        let { id } = req.params;
        let coupon = await Coupon.findOne({idCourse: id, type: 'public'});

        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        const currentDate = new Date();
        if (currentDate > new Date( coupon.expirationDate )) {
            return res.status(400).json({ error: 'Coupon has expired' });
        }

        res.json({ discount: coupon.discount, expirationDate: coupon.expirationDate, code: coupon.code });
    } catch (error) {
        res.status(400).json({ error: error.message });
    } 
}

const deleteCoupon = async (req, res) => {
    try {
        let result = await Coupon.findOneAndDelete({ _id: req.params.id });
        res.status(200).send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const editCoupon = async (req, res) => {
    try {
        let result = await Coupon.findByIdAndUpdate({ _id: req.params.id }, req.body);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const applyCoupon = async (req, res) => {
    try {
        let { code, idCourse } = req.body;
        let coupon = await Coupon.findOne({code, idCourse});

        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        const currentDate = new Date();
        if (currentDate > new Date( coupon.expirationDate )) {
            return res.status(400).json({ error: 'Coupon has expired' });
        }

        res.json({ discount: coupon.discount });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const verifyCoupoun = async (req, res) => {

}


module.exports = {
    generateCoupon,
    listCoupon,
    byIdCoupon,
    editCoupon,
    applyCoupon,
    verifyCoupoun,
    deleteCoupon,
    byIdCourse
}