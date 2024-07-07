const Ads = require('../models/ads.model');

const generateAds = async () => {
    try {
        let result = await Ads.find()
        if(result.length == 0){
            let ads = new Ads();
             await ads.save();
            console.log('ads space created');
        }
    } catch (error) {
        console.log(error);
    }
}

const listAds = async (req, res) => {
    try {
        let result = await Ads.find()
        res.status(200).send(result[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}




const deleteAds = async (req, res) => {
    try {
        let result = await Ads.findOneAndDelete({ _id: req.params.id });
        res.status(200).send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const editAds = async (req, res) => {
    try {
        let result = await Ads.findByIdAndUpdate({ _id: req.params.id }, req.body);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


const editBanner1 = async (req, res, fileName) => {
    try {
        data = req.body;
        if(fileName.length>0){
            data.banner1 = fileName;
        }
        let result = await Ads.findByIdAndUpdate({ _id: req.params.id }, data);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const editBanner2 = async (req, res, fileName) => {
    try {
        data = req.body;
        if(fileName.length>0){
            data.banner2 = fileName;
        }
        let result = await Ads.findByIdAndUpdate({ _id: req.params.id }, data);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const editBanner3 = async (req, res, fileName) => {
    try {
        data = req.body;
        if(fileName.length>0){
            data.banner3 = fileName;
        }
        let result = await Ads.findByIdAndUpdate({ _id: req.params.id }, data);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const editBanner4 = async (req, res, fileName) => {
    try {
        data = req.body;
        if(fileName.length>0){
            data.banner4 = fileName;
        }
        let result = await Ads.findByIdAndUpdate({ _id: req.params.id }, data);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const editBanner5 = async (req, res, fileName) => {
    try {
        data = req.body;
        if(fileName.length>0){
            data.banner5 = fileName;
        }
        let result = await Ads.findByIdAndUpdate({ _id: req.params.id }, data);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}



module.exports = {
    generateAds,
    listAds,
    editAds,
    deleteAds,
    editBanner1,
    editBanner2,
    editBanner3,
    editBanner4,
    editBanner5

}