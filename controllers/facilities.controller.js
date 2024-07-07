const Facilitie = require('../models/facilitie.model');


const createFacilitie = async (req, res) => {

    try {

        let facilitie = new Facilitie(req.body);
        let result = await facilitie.save();
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const getAllFacilities = async (req, res) => {

    try {

        let result = await facilitie.find({ archived: false });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const getFacilitiesByMainCategorie = async (req, res) => {

    try {
        let { main } = req.params;
        let result = await Facilitie.find({ maincategorie: main, archived: false });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const getFacilitieById = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await Facilitie.findById({ _id: id });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const deleteFacilitie = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await Facilitie.findByIdAndDelete({ _id: id });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const updateFacilitie = async (req, res) => {

    try {
        
        let { id } = req.params;
        let data = req.body;
        let result = await Facilitie.findByIdAndUpdate({ _id: id }, data);
        res.status(200).send(result);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const archiveFacilitie = async (req, res) => {

    try {
        
        let { id } = req.params;
        let result = await Facilitie.findByIdAndUpdate({ _id: id }, { archived: true });
        res.status(200).send(result);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const restoreFacilitie = async (req, res) => {

    try {
        
        let { id } = req.params;
        let result = await Facilitie.findByIdAndUpdate({ _id: id }, { archived: false });
        res.status(200).send(result);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const archiveListFacilities = async (req, res) => {

    try {

        let result = await Facilitie.find({ archived: true });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

module.exports = {
    createFacilitie,
    getAllFacilities,
    getFacilitieById,
    deleteFacilitie,
    updateFacilitie,
    getFacilitiesByMainCategorie,
    archiveListFacilities,
    archiveFacilitie,
    restoreFacilitie
}