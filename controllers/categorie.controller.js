const Categorie = require('../models/categorie.model');


const createCategorie = async (req, res) => {

    try {

        let categorie = new Categorie(req.body);
        let result = await categorie.save();
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const getAllCategories = async (req, res) => {

    try {

        let result = await Categorie.find({ archived: false });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}



const getCategorieById = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await Categorie.findById({ _id: id });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const deleteCategorie = async (req, res) => {

    try {

        let id = req.params.id;
        let result = await Categorie.findByIdAndDelete({ _id: id });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const updateCategorie = async (req, res) => {

    try {
        
        let { id } = req.params;
        let data = req.body;
        let result = await Categorie.findByIdAndUpdate({ _id: id }, data);
        res.status(200).send(result);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const archiveCategorie = async (req, res) => {

    try {
        
        let { id } = req.params;
        let result = await Categorie.findByIdAndUpdate({ _id: id }, { archived: true });
        res.status(200).send(result);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const restoreCategorie = async (req, res) => {

    try {
        
        let { id } = req.params;
        let result = await Categorie.findByIdAndUpdate({ _id: id }, { archived: false });
        res.status(200).send(result);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const archiveListCategories = async (req, res) => {

    try {

        let result = await Categorie.find({ archived: true });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


module.exports = {
    createCategorie,
    getAllCategories,
    getCategorieById,
    deleteCategorie,
    updateCategorie,
    archiveListCategories,
    restoreCategorie,
    archiveCategorie
}