const Commerce = require('../models/commerce.model');
Commerce.createIndexes();

const ObjectId = require('mongodb').ObjectId;
const Review = require('../models/review.model');
const MainCategorie = require('../models/maincategorie.model');
const SubCategorie = require('../models/subcategorie.model');
const Facilitie = require('../models/facilitie.model');
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');


// for admin with full access
const createCommerce = async (req, res) => {

    try {
        const {
            title, slog, owner, description, maincategorie, subcategorie,
            city, address, state, zip, email, phone, website,
            facebook, twitter, linkedin, facilities, keywords, openingHours
        } = req.body;

        const mainImage = req.files['image'] ? req.files['image'][0].filename : null;
        const gallery = req.files['gallery'] ? req.files['gallery'].map(file => file.filename) : [];
        const pricingList = req.files['pricingList'] ? req.files['pricingList'].map(file => file.filename) : [];

        const commerce = new Commerce({
            title,
            slog,
            owner,
            description,
            maincategorie,
            subcategorie,
            city,
            address,
            state,
            zip,
            email,
            phone,
            website,
            facebook,
            twitter,
            linkedin,
            facilities: JSON.parse(facilities),
            keywords: JSON.parse(keywords),
            openingHours: JSON.parse(openingHours),
            image: mainImage,
            gallery,
            pricingList
        });

        let savedCommerce = await commerce.save();
        res.status(200).send(savedCommerce);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

// for commercial with minm access

const createMyCommerce = async (req, res) => {

    try {
        const user = await jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY_USER);
        const {
            title, slog, description, maincategorie, subcategorie,
            city, address, state, zip, email, phone, website,
            facebook, twitter, linkedin, facilities, keywords, openingHours
        } = req.body;

        const mainImage = req.files['image'] ? req.files['image'][0].filename : null;
        const gallery = req.files['gallery'] ? req.files['gallery'].map(file => file.filename) : [];
        const pricingList = req.files['pricingList'] ? req.files['pricingList'].map(file => file.filename) : [];

        const commerce = new Commerce({
            title,
            slog,
            owner: user.id,
            description,
            maincategorie,
            subcategorie,
            city,
            address,
            state,
            zip,
            email,
            phone,
            website,
            facebook,
            twitter,
            linkedin,
            facilities: JSON.parse(facilities),
            keywords: JSON.parse(keywords),
            openingHours: JSON.parse(openingHours),
            image: mainImage,
            gallery,
            pricingList
        });

        let savedCommerce = await commerce.save();
        res.status(200).send(savedCommerce);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const existSlog = async (req, res) => {

    try {

        let { slog, id } = req.params;
        let exist = await Commerce.exists({ slog: slog });

        if (exist) {

            if (id.length > 5) {

                if (exist._id == id) {
                    res.status(200).json({ exist: false });
                } else {
                    res.status(200).json({ exist: true });
                }

            } else {
                res.status(200).json({ exist: true });
            }

        } else {
            res.status(200).json({ exist: false });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getPaginatedCommerces = async (req, res) => {
    try {
        const { page = 1, limit = 12, search = '', location = '', category = '', subcategories = '', facilities = '' } = req.query;


        // Parse the subcategories and facilities from the query string into arrays
        const subcategoriesArray = subcategories ? subcategories.split(',') : [];
        const facilitiesArray = facilities ? facilities.split(',') : [];


        const match = {
            status: 'active',
            ...(search && { $text: { $search: search } }),
            ...(location && { city: location }),
            ...(category && { maincategorie: mongoose.Types.ObjectId(category) }),
            ...(subcategoriesArray.length && { subcategorie: { $in: subcategoriesArray.map(id => mongoose.Types.ObjectId(id)) } }),
            ...(facilitiesArray.length && { facilities: { $in: facilitiesArray.map(id => mongoose.Types.ObjectId(id)) } })
        };

        let result = await Commerce.aggregate([
            { $match: match },
            { $sort: { modifyDate: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: 'maincategories',
                    localField: 'maincategorie',
                    foreignField: '_id',
                    as: 'maincategorie'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategorie',
                    foreignField: '_id',
                    as: 'subcategorie'
                }
            },
            {
                $lookup: {
                    from: 'facilities',
                    localField: 'facilities',
                    foreignField: '_id',
                    as: 'facilities'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner'
                }
            },
            {
                $unwind: '$owner'
            },
            {
                $project: {
                    title: 1,
                    slog: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    maincategorie: 1,
                    subcategorie: 1,
                    facilities: 1,
                    keywords: 1,
                    image: 1,
                    gallery: 1,
                    city: 1,
                    averageRating: 1,
                    openingHours: 1,
                    owner: {
                        fullname: 1,
                        image: 1,
                        ville: 1
                    }
                }
            }
        ]);



        const total = await Commerce.countDocuments(match);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({ commerces: result, total, currentPage: page, totalPages });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};


// for admin with full access
const getPagePendingCommerces = async (req, res) => {

    try {
        let { page } = req.params;
        let startIndex = (page - 1) * 10;
        let result = await Commerce.aggregate([
            { $match: { status: 'pending' } },
            { $sort: { eid: 1, modifyDate: 1 } },
            { $skip: startIndex },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'maincategories',
                    localField: 'maincategorie',
                    foreignField: '_id',
                    as: 'maincategorie'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategorie',
                    foreignField: '_id',
                    as: 'subcategorie'
                }
            }
            ,
            {
                $lookup: {
                    from: 'facilities',
                    localField: 'facilities',
                    foreignField: '_id',
                    as: 'facilities'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner'
                }
            },
            {
                $unwind: '$owner'
            },
            {
                $project: {
                    title: 1,
                    slog: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    maincategorie: 1,
                    subcategorie: 1,
                    facilities: 1,
                    keywords: 1,
                    image: 1,
                    gallery: 1,
                    video: 1,
                    city: 1,
                    address: 1,
                    state: 1,
                    zip: 1,
                    email: 1,
                    website: 1,
                    phone: 1,
                    facebook: 1,
                    twitter: 1,
                    linkedin: 1,
                    status: 1,
                    featured: 1,
                    archived: 1,
                    public: 1,
                    averageRating: 1,
                    openingHours: 1,
                    owner: {
                        fullname: 1,
                        image: 1,
                        email: 1,
                        ville: 1
                    }
                }
            }
        ])


        res.status(200).json({
            commerces: result,
            page: page,
            total: await Commerce.count({ status: 'pending' })
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}

const getPageActiveCommerces = async (req, res) => {

    try {
        let { page } = req.params;
        let startIndex = (page - 1) * 10;
        let result = await Commerce.aggregate([
            { $match: { status: 'active' } },
            { $sort: { eid: 1, modifyDate: 1 } },
            { $skip: startIndex },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'maincategories',
                    localField: 'maincategorie',
                    foreignField: '_id',
                    as: 'maincategorie'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategorie',
                    foreignField: '_id',
                    as: 'subcategorie'
                }
            }
            ,
            {
                $lookup: {
                    from: 'facilities',
                    localField: 'facilities',
                    foreignField: '_id',
                    as: 'facilities'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner'
                }
            },
            {
                $unwind: '$owner'
            },
            {
                $project: {
                    title: 1,
                    slog: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    maincategorie: 1,
                    subcategorie: 1,
                    facilities: 1,
                    keywords: 1,
                    image: 1,
                    gallery: 1,
                    video: 1,
                    city: 1,
                    address: 1,
                    state: 1,
                    zip: 1,
                    email: 1,
                    website: 1,
                    phone: 1,
                    facebook: 1,
                    twitter: 1,
                    linkedin: 1,
                    status: 1,
                    featured: 1,
                    archived: 1,
                    public: 1,
                    averageRating: 1,
                    openingHours: 1,
                    owner: {
                        fullname: 1,
                        image: 1,
                        email: 1,
                        ville: 1
                    }
                }
            }
        ])


        res.status(200).json({
            commerces: result,
            page: page,
            total: await Commerce.count({ status: 'active' })
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}

const getPageArchivedCommerces = async (req, res) => {

    try {
        let { page } = req.params;
        let startIndex = (page - 1) * 10;
        let result = await Commerce.aggregate([
            { $match: { status: 'archived' } },
            { $sort: { eid: 1, modifyDate: 1 } },
            { $skip: startIndex },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'maincategories',
                    localField: 'maincategorie',
                    foreignField: '_id',
                    as: 'maincategorie'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategorie',
                    foreignField: '_id',
                    as: 'subcategorie'
                }
            }
            ,
            {
                $lookup: {
                    from: 'facilities',
                    localField: 'facilities',
                    foreignField: '_id',
                    as: 'facilities'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner'
                }
            },
            {
                $unwind: '$owner'
            },
            {
                $project: {
                    title: 1,
                    slog: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    maincategorie: 1,
                    subcategorie: 1,
                    facilities: 1,
                    keywords: 1,
                    image: 1,
                    gallery: 1,
                    video: 1,
                    city: 1,
                    address: 1,
                    state: 1,
                    zip: 1,
                    email: 1,
                    website: 1,
                    phone: 1,
                    facebook: 1,
                    twitter: 1,
                    linkedin: 1,
                    status: 1,
                    featured: 1,
                    archived: 1,
                    public: 1,
                    averageRating: 1,
                    openingHours: 1,
                    owner: {
                        fullname: 1,
                        image: 1,
                        email: 1,
                        ville: 1
                    }
                }
            }
        ])


        res.status(200).json({
            commerces: result,
            page: page,
            total: await Commerce.count({ status: 'archived' })
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}


// for commercial

const getMyPagePendingCommerces = async (req, res) => {

    try {
        const user = await jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY_USER);
        let { page } = req.params;
        let startIndex = (page - 1) * 10;
        let result = await Commerce.aggregate([
            { $match: { status: 'pending', owner: mongoose.Types.ObjectId(user.id) } },
            { $sort: { eid: 1, modifyDate: 1 } },
            { $skip: startIndex },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'maincategories',
                    localField: 'maincategorie',
                    foreignField: '_id',
                    as: 'maincategorie'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategorie',
                    foreignField: '_id',
                    as: 'subcategorie'
                }
            }
            ,
            {
                $lookup: {
                    from: 'facilities',
                    localField: 'facilities',
                    foreignField: '_id',
                    as: 'facilities'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner'
                }
            },
            {
                $unwind: '$owner'
            },
            {
                $project: {
                    title: 1,
                    slog: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    maincategorie: 1,
                    subcategorie: 1,
                    facilities: 1,
                    keywords: 1,
                    image: 1,
                    gallery: 1,
                    video: 1,
                    city: 1,
                    address: 1,
                    state: 1,
                    zip: 1,
                    email: 1,
                    website: 1,
                    phone: 1,
                    facebook: 1,
                    twitter: 1,
                    linkedin: 1,
                    status: 1,
                    featured: 1,
                    archived: 1,
                    public: 1,
                    averageRating: 1,
                    openingHours: 1,
                    owner: {
                        fullname: 1,
                        image: 1,
                        email: 1,
                        ville: 1
                    }
                }
            }
        ])


        res.status(200).json({
            commerces: result,
            page: page,
            total: await Commerce.count({ status: 'pending' })
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}

const getMyPageActiveCommerces = async (req, res) => {

    try {
        const user = await jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY_USER);

        let { page } = req.params;
        let startIndex = (page - 1) * 10;
        let result = await Commerce.aggregate([
            { $match: { status: 'active', owner: mongoose.Types.ObjectId(user.id) } },
            { $sort: { eid: 1, modifyDate: 1 } },
            { $skip: startIndex },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'maincategories',
                    localField: 'maincategorie',
                    foreignField: '_id',
                    as: 'maincategorie'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategorie',
                    foreignField: '_id',
                    as: 'subcategorie'
                }
            }
            ,
            {
                $lookup: {
                    from: 'facilities',
                    localField: 'facilities',
                    foreignField: '_id',
                    as: 'facilities'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner'
                }
            },
            {
                $unwind: '$owner'
            },
            {
                $project: {
                    title: 1,
                    slog: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    maincategorie: 1,
                    subcategorie: 1,
                    facilities: 1,
                    keywords: 1,
                    image: 1,
                    gallery: 1,
                    video: 1,
                    city: 1,
                    address: 1,
                    state: 1,
                    zip: 1,
                    email: 1,
                    website: 1,
                    phone: 1,
                    facebook: 1,
                    twitter: 1,
                    linkedin: 1,
                    status: 1,
                    featured: 1,
                    archived: 1,
                    public: 1,
                    averageRating: 1,
                    openingHours: 1,
                    owner: {
                        fullname: 1,
                        image: 1,
                        email: 1,
                        ville: 1
                    }
                }
            }
        ])


        res.status(200).json({
            commerces: result,
            page: page,
            total: await Commerce.count({ status: 'active' })
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}

const getMyPageArchivedCommerces = async (req, res) => {

    try {
        const user = await jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY_USER);

        let { page } = req.params;
        let startIndex = (page - 1) * 10;
        let result = await Commerce.aggregate([
            { $match: { status: 'archived' , owner: mongoose.Types.ObjectId(user.id)} },
            { $sort: { eid: 1, modifyDate: 1 } },
            { $skip: startIndex },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'maincategories',
                    localField: 'maincategorie',
                    foreignField: '_id',
                    as: 'maincategorie'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategorie',
                    foreignField: '_id',
                    as: 'subcategorie'
                }
            }
            ,
            {
                $lookup: {
                    from: 'facilities',
                    localField: 'facilities',
                    foreignField: '_id',
                    as: 'facilities'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner'
                }
            },
            {
                $unwind: '$owner'
            },
            {
                $project: {
                    title: 1,
                    slog: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    maincategorie: 1,
                    subcategorie: 1,
                    facilities: 1,
                    keywords: 1,
                    image: 1,
                    gallery: 1,
                    video: 1,
                    city: 1,
                    address: 1,
                    state: 1,
                    zip: 1,
                    email: 1,
                    website: 1,
                    phone: 1,
                    facebook: 1,
                    twitter: 1,
                    linkedin: 1,
                    status: 1,
                    featured: 1,
                    archived: 1,
                    public: 1,
                    averageRating: 1,
                    openingHours: 1,
                    owner: {
                        fullname: 1,
                        image: 1,
                        email: 1,
                        ville: 1
                    }
                }
            }
        ])


        res.status(200).json({
            commerces: result,
            page: page,
            total: await Commerce.count({ status: 'archived' })
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}



const getPageCommercesClient = async (req, res) => {

    try {

        let result = await Commerce.aggregate([
            { $match: { status: 'public' } },
            { $sort: { eid: 1, modifyDate: 1 } },
            {
                $lookup: {
                    from: 'maincategories',
                    localField: 'maincategorie',
                    foreignField: '_id',
                    as: 'maincategorie'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategorie',
                    foreignField: '_id',
                    as: 'subcategorie'
                }
            }
            ,
            {
                $lookup: {
                    from: 'facilities',
                    localField: 'facilities',
                    foreignField: '_id',
                    as: 'facilities'
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    maincategorie: 1,
                    subcategorie: 1,
                    facilities: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    slog: 1,
                    image: 1
                }
            }
        ])

        res.status(200).json({
            Commerces: result
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }



}

const getCommercesTitles = async (req, res) => {

    try {

        let result = await Commerce.aggregate([
            { $match: { archived: false } },
            { $sort: { eid: 1, modifyDate: 1 } },
            { $project: { title: 1 } }
        ])

        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const getCommerceByCategorie = async (req, res) => {

    try {

        let { cat } = req.params;
        let result = await Commerce.aggregate([
            { $match: { maincategorie: ObjectId(cat), public: true, archived: false } },
            { $sort: { eid: 1, modifyDate: 1 } },
            {
                $project: {
                    title: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    slog: 1,
                    image: 1
                }
            }

        ])
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const getRelatedCommerce = async (req, res) => {

    try {

        let { cat } = req.params;
        let result = await Commerce.aggregate([
            { $match: { maincategorie: ObjectId(cat), public: true, archived: false } },
            { $sort: { eid: 1, modifyDate: 1 } },
            { $limit: 4 },
            {
                $project: {
                    title: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    slog: 1,
                    image: 1
                }
            }

        ])
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const searchCommerces = async (req, res) => {

    try {

        let { keyword, categorie } = req.params;
        const result = await Commerce.aggregate([
            { $match: { public: true, archived: false } },
            { $sort: { eid: 1, modifyDate: 1 } },
            {
                $lookup: {
                    from: 'maincategories',
                    localField: 'maincategorie',
                    foreignField: '_id',
                    as: 'maincategorie'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategorie',
                    foreignField: '_id',
                    as: 'subcategorie'
                }
            }
            ,
            {
                $lookup: {
                    from: 'facilities',
                    localField: 'facilities',
                    foreignField: '_id',
                    as: 'facilities'
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    maincategorie: 1,
                    subcategorie: 1,
                    facilities: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    slog: 1,
                    image: 1
                }
            }

        ])

        let filteredResult = result.filter(item => {
            return (item.title.toUpperCase().includes(keyword.toUpperCase()) ||
                item.description.toUpperCase().includes(keyword.toUpperCase()) ||
                item.overview.toUpperCase().includes(keyword.toUpperCase()) ||
                item.maincategorie[0].name.toUpperCase().includes(categorie.toUpperCase()))
        })

        res.status(200).send(filteredResult);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const getCommerceById = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await Commerce.findById({ _id: id })

        let maincategorie = await MainCategorie.findById({ _id: result.maincategorie });
        let subcategorie = await SubCategorie.findById({ _id: result.subcategorie });
        let facilities = await Facilitie.findById({ _id: result.facilities });

        result.maincategorie = maincategorie;
        result.subcategorie = subcategorie;
        result.facilities = facilities;

        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const getCommerceBySlog = async (req, res) => {

    try {
        const { slog = '' } = req.params;


    
        const match = {
            status: 'active',
          
            ...(slog && { slog }),
           
        };

        let result = await Commerce.aggregate([
            { $match: match },
         
            {
                $lookup: {
                    from: 'maincategories',
                    localField: 'maincategorie',
                    foreignField: '_id',
                    as: 'maincategorie'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategorie',
                    foreignField: '_id',
                    as: 'subcategorie'
                }
            },
            {
                $lookup: {
                    from: 'facilities',
                    localField: 'facilities',
                    foreignField: '_id',
                    as: 'facilities'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner'
                }
            },
            {
                $unwind: '$owner'
            },
            {
                $project: {
                    title: 1,
                    slog: 1,
                    description: 1,
                    phone: 1,
                    email: 1,
                    website:1,
                    facebook:1,
                    twitter: 1,
                    linkedin: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    maincategorie: 1,
                    subcategorie: 1,
                    facilities: 1,
                    keywords: 1,
                    image: 1,
                    gallery: 1,
                    pricingList: 1,
                    city: 1,
                    address: 1,
                    state: 1,
                    averageRating: 1,
                    openingHours: 1,
                    owner: {
                        fullname: 1,
                        image: 1,
                        ville: 1
                    }
                }
            }
        ]);



        let reviewCount = await Review.countDocuments({ idCommerce: result[0]._id });

        res.status(200).json({ commerce: result[0], reviewCount });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}

const getCommerceImageBySlog = async (req, res) => {

    try {

        let { slog } = req.params;
        let commerce = await Commerce.findOne(
            { slog: slog, archived: false },
            {
                image: 1,
            }
        )

        res.status(200).json({ commerce });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}




const deleteCommerce = async (req, res) => {

    try {

        let { id } = req.params;
        const deletedCommerce = await Commerce.findByIdAndDelete({ _id: id });
        res.status(200).send(deletedCommerce);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const updateCommerce = async (req, res, fileName) => {

    try {

        let { id } = req.params;
        let data = req.body;

        if (fileName.length > 0) {
            data.image = fileName;
        }

        let result = await Commerce.findByIdAndUpdate({ _id: id }, data);
        res.status(200).send(result);

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}

const archiveCommerce = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await Commerce.findByIdAndUpdate({ _id: id }, { status: 'archived' });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const restoreCommerce = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await Commerce.findByIdAndUpdate({ _id: id }, { status: 'pending' });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const updateCommerceStatus = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await Commerce.findByIdAndUpdate({ _id: id }, { status: req.body.status });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}



const featuredCommerce = async (req, res) => {

    try {

        let { id } = req.params;
        let { featured } = req.body;
        let result = await Commerce.findByIdAndUpdate({ _id: id }, { featured: featured });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const getFeaturedCommerces = async (req, res) => {

    try {
        console.log('eeeeee');
        let result = await Commerce.aggregate([
            { $match: { featured: true, status: 'active' } },
            { $sort: { eid: 1, modifyDate: 1 } },
            {
                $lookup: {
                    from: 'maincategories',
                    localField: 'maincategorie',
                    foreignField: '_id',
                    as: 'maincategorie'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategorie',
                    foreignField: '_id',
                    as: 'subcategorie'
                }
            }
            ,
            {
                $lookup: {
                    from: 'facilities',
                    localField: 'facilities',
                    foreignField: '_id',
                    as: 'facilities'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner'
                }
            },
            {
                $unwind: '$owner'
            },
            {
                $project: {
                    title: 1,
                    slog: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    maincategorie: 1,
                    subcategorie: 1,
                    facilities: 1,
                    keywords: 1,
                    image: 1,
                    gallery: 1,
                    city: 1,
                    averageRating: 1,
                    openingHours: 1,
                    owner: {
                        fullname: 1,
                        image: 1,
                        ville: 1
                    }
                }
            }
        ])

        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const getRecentCommerces = async (req, res) => {

    try {

        let result = await Commerce.aggregate([
            { $match: { featured: true, status: 'active' } },
            { $sort: { eid: 1, modifyDate: 1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'maincategories',
                    localField: 'maincategorie',
                    foreignField: '_id',
                    as: 'maincategorie'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategorie',
                    foreignField: '_id',
                    as: 'subcategorie'
                }
            }
            ,
            {
                $lookup: {
                    from: 'facilities',
                    localField: 'facilities',
                    foreignField: '_id',
                    as: 'facilities'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner'
                }
            },
            {
                $unwind: '$owner'
            },
            {
                $project: {
                    title: 1,
                    slog: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    maincategorie: 1,
                    subcategorie: 1,
                    facilities: 1,
                    keywords: 1,
                    image: 1,
                    gallery: 1,
                    city: 1,
                    averageRating: 1,
                    openingHours: 1,
                    owner: {
                        fullname: 1,
                        image: 1,
                        ville: 1
                    }
                }
            }
        ])
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


module.exports = {
    createCommerce,
    createMyCommerce,
    existSlog,
    getPaginatedCommerces,
    getPageActiveCommerces,
    getPageArchivedCommerces,
    getPagePendingCommerces,
    getMyPageActiveCommerces,
    getMyPageArchivedCommerces,
    getMyPagePendingCommerces,
    getPageCommercesClient,
    getCommercesTitles,
    getCommerceByCategorie,
    getRelatedCommerce,
    getCommerceById,
    getCommerceBySlog,
    getCommerceImageBySlog,
    deleteCommerce,
    updateCommerce,
    searchCommerces,
    restoreCommerce,
    archiveCommerce,
    featuredCommerce,
    getFeaturedCommerces,
    updateCommerceStatus,
    getRecentCommerces
}