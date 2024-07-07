const SubCategorie = require('../models/subcategorie.model');


const createSubCategorie = async (req, res) => {

    try {

        let subCategorie = new SubCategorie(req.body);
        let result = await subCategorie.save();
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const getAllSubCategories = async (req, res) => {

    try {

        let result = await SubCategorie.find({ archived: false });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const getSubCategoriesByMainCategorie = async (req, res) => {

    try {
        let { main } = req.params;
        let result = await SubCategorie.find({ maincategorie: main, archived: false });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const getSubCategorieById = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await SubCategorie.findById({ _id: id });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const deleteSubCategorie = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await SubCategorie.findByIdAndDelete({ _id: id });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const updateSubCategorie = async (req, res) => {

    try {
        
        let { id } = req.params;
        let data = req.body;
        let result = await SubCategorie.findByIdAndUpdate({ _id: id }, data);
        res.status(200).send(result);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const archiveSubCategorie = async (req, res) => {

    try {
        
        let { id } = req.params;
        let result = await SubCategorie.findByIdAndUpdate({ _id: id }, { archived: true });
        res.status(200).send(result);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const restoreSubCategorie = async (req, res) => {

    try {
        
        let { id } = req.params;
        let result = await SubCategorie.findByIdAndUpdate({ _id: id }, { archived: false });
        res.status(200).send(result);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const archiveListSubCategories = async (req, res) => {

    try {

        let result = await SubCategorie.find({ archived: true });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

module.exports = {
    createSubCategorie,
    getAllSubCategories,
    getSubCategorieById,
    deleteSubCategorie,
    updateSubCategorie,
    getSubCategoriesByMainCategorie,
    archiveListSubCategories,
    archiveSubCategorie,
    restoreSubCategorie
}