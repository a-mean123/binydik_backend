const Testimonial = require('../models/testimonial.model');


const createTestimonial = async (req, res, fileName) => {

    try {

        testimonial.image = fileName;
        let testimonial = new Testimonial(req.body);
        let savedTestimonial = await testimonial.save();
        res.status(200).send(savedTestimonial);

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}



const getPageTestimonials = async (req, res) => {

    try {
        let { page } = req.params;
        let startIndex = (page - 1) * 10;
        let result = await Testimonial.aggregate([
            { $sort: { eid: 1, modifyDate: 1 } },
            { $skip: startIndex },
            { $limit: 10 }
        ])

        res.status(200).json({
            testimonials: result,
            page: page,
            total: await Testimonial.countDocuments()
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}



const getAllTestimonials = async (req, res) => {

    try {

        let result = await Testimonial.find();

        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}




const getTestimonialById = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await Testimonial.findById({ _id: id });

        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}





const deleteTestimonial = async (req, res) => {

    try {

        let { id } = req.params;
        const deletedTestimonial = await Testimonial.findByIdAndDelete({ _id: id });
        res.status(200).send(deletedTestimonial);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const updateTestimonial = async (req, res, fileName) => {

    try {

        let { id } = req.params;
        let data = req.body;

        if(fileName.length > 0){
            data.image = fileName;
        }

        let result = await Testimonial.findByIdAndUpdate({ _id: id }, data);
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const featuredTestimonial = async (req, res) => {

    try {

        let { id } = req.params;
        let { featured } = req.body;
        let result = await Testimonial.findByIdAndUpdate({ _id: id }, { featured: featured });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const getFeaturedTestimonials = async (req, res) => {

    try {

        let result = await Testimonial.find({ featured: true });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}





module.exports = {
    createTestimonial,
    getPageTestimonials,
    getTestimonialById,
    deleteTestimonial,
    updateTestimonial,
    getAllTestimonials,
    featuredTestimonial,
    getFeaturedTestimonials
}