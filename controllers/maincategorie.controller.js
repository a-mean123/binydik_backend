const MainCategorie = require('../models/maincategorie.model');


const createMainCategorie = async (req, res) => {

    try {

        let mainCategorie = new MainCategorie(req.body);
        let result = await mainCategorie.save();
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const getAllMainCategories = async (req, res) => {

    try {

        let result = await MainCategorie.find({ archived: false });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const getAllMainCategoriesWithSubCategorie = async (req, res) => {

    try {

        let result = await MainCategorie.aggregate([
            { $match: { archived: false } },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: '_id',
                    foreignField: 'maincategorie',
                    as: 'subcategories'
                }
            },
            {
                $lookup: {
                    from: 'facilities',
                    localField: '_id',
                    foreignField: 'maincategorie',
                    as: 'facilities'
                }
            },
            {
                $lookup: {
                    from: 'commerces',
                    localField: '_id',
                    foreignField: 'maincategorie',
                    as: 'commerces'
                }
            },
            {
                $addFields: {
                    numberOfCommerces: { $size: '$commerces' }
                }
            },
            {
                $project: {
                    commerces: 0  // Remove the actual commerces array from the result, if not needed
                }
            }
        ])
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const getMainCategorieById = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await MainCategorie.findById({ _id: id });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const deleteMainCategorie = async (req, res) => {

    try {

        let id = req.params.id;
        let result = await MainCategorie.findByIdAndDelete({ _id: id });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const updateMainCategorie = async (req, res) => {

    try {
        
        let { id } = req.params;
        let data = req.body;
        let result = await MainCategorie.findByIdAndUpdate({ _id: id }, data);
        res.status(200).send(result);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const archiveMainCategorie = async (req, res) => {

    try {
        
        let { id } = req.params;
        let result = await MainCategorie.findByIdAndUpdate({ _id: id }, { archived: true });
        res.status(200).send(result);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const restoreMainCategorie = async (req, res) => {

    try {
        
        let { id } = req.params;
        let result = await MainCategorie.findByIdAndUpdate({ _id: id }, { archived: false });
        res.status(200).send(result);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const archiveListMainCategories = async (req, res) => {

    try {

        let result = await MainCategorie.find({ archived: true });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const featuredCategorie = async (req, res) => {

    try {

        let { id } = req.params;
        let { featured } = req.body;
        let result = await MainCategorie.findByIdAndUpdate({ _id: id }, { featured: featured });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const getFeaturedCategories = async (req, res) => {

    try {

        let result = await MainCategorie.aggregate([
            { $match: { featured: true } },
            { $sort: { eid: 1, modifyDate: 1 } }
        ])
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


module.exports = {
    createMainCategorie,
    getAllMainCategories,
    getAllMainCategoriesWithSubCategorie,
    getMainCategorieById,
    deleteMainCategorie,
    updateMainCategorie,
    archiveListMainCategories,
    restoreMainCategorie,
    archiveMainCategorie,
    featuredCategorie,
    getFeaturedCategories
}