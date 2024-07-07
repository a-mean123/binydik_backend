const Article = require('../models/article.model');
const ObjectId = require('mongodb').ObjectId;

const Categorie = require('../models/categorie.model');

const createArticle = async (req, res, fileName) => {

    try {
        let article = new Article({
            ...req.body,
            image: fileName,
            tags: JSON.parse(req.body.tags)
        });
        let savedArticle = await article.save();
        res.status(200).send(savedArticle);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const existSlog = async (req, res) => {

    try {

        let { slog, id } = req.params;
        let exist = await Article.exists({ slog: slog });

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


const getPageArticles = async (req, res) => {

    try {
        let { page } = req.params;
        let startIndex = (page - 1) * 10;
        let result = await Article.aggregate([
            { $match: { archived: false } },
            { $sort: { eid: 1, modifyDate: 1 } },
            { $skip: startIndex },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categorie',
                    foreignField: '_id',
                    as: 'categorie'
                }
            }
        ])

        res.status(200).json({
            articles: result,
            page: page,
            total: await Article.countDocuments({ archived: false })
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}

const getPageArticlesForClientSide = async (req, res) => {

    try {
        let { page, categorie } = req.params;
        let startIndex = (page - 1) * 9;
        let result = null;
        let total = 0;
        if (categorie != 'null') {
            let cat = await Categorie.findOne({ name: categorie });
            result = await Article.aggregate([
                { $match: {categorie: ObjectId(cat._id), public: true, archived: false } },
                { $sort: { eid: 1, modifyDate: 1 } },
                { $skip: startIndex },
                { $limit: 9 },
                {
                    $project: {
                        title: 1,
                        description: 1,
                        date: 1,
                        image: 1,
                        slog: 1,
                        categorie: 1
                    }
                }
            ])

            total = await Article.countDocuments({ categorie: ObjectId(cat._id), public: true, archived: false })

        }else{
            result = await Article.aggregate([
                { $match: { public: true, archived: false } },
                { $sort: { eid: 1, modifyDate: 1 } },
                { $skip: startIndex },
                { $limit: 9 },
                {
                    $project: {
                        title: 1,
                        description: 1,
                        date: 1,
                        image: 1,
                        slog: 1,
                        categorie: 1
                    }
                }
            ])
            total = await Article.countDocuments({ public: true, archived: false })

        }

        res.status(200).json({
            articles: result,
            page: page,
            total: total
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const getArticlesTitles = async (req, res) => {

    try {
     
        let result = await Article.aggregate([
            { $match: { archived: false } },
            { $sort: { eid: 1, modifyDate: 1 } },
            { $project: { title: 1 } }
           
        ])

        res.status(200).json(result);

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}


const getArticleByCategorie = async (req, res) => {

    try {

        let categorie = req.params.cat;
        let result = await Article.aggregate([
            { $match: { categorie: ObjectId(categorie), public: true, archived: false } },
            { $sort: { eid: 1, modifyDate: 1 } },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categorie',
                    foreignField: '_id',
                    as: 'categorie'
                }
            }
        ])
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


// const getArticleBySubCategorie = async (req, res) => {

//     try {

//         let subcategorie = req.params.cat;
//         let result = await Article.aggregate([
//             { $match: { maincategorie: ObjectId(subcategorie), public: true, archived: false } },
//             { $sort: { eid: 1, modifyDate: 1 } },
//             {
//                 $lookup: {
//                     from: 'maincategories',
//                     localField: 'maincategorie',
//                     foreignField: '_id',
//                     as: 'maincategorie'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'subcategories',
//                     localField: 'subcategorie',
//                     foreignField: '_id',
//                     as: 'subcategorie'
//                 }
//             }
//         ])
//         res.status(200).send(result);

//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }

// }


const searchArticles = async (req, res) => {
    try {
        let keyword = req.params.keyword;
        const result = await Article.aggregate([
            { $match: { public: true, archived: false } },
            { $sort: { eid: 1, modifyDate: 1 } },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categorie',
                    foreignField: '_id',
                    as: 'categorie'
                }
            }
        ])

        
        let filteredResult = result.filter(item => {
            return (item.title.toUpperCase().includes(keyword.toUpperCase()) ||
                item.description.toUpperCase().includes(keyword.toUpperCase()) ||
                item.content.toUpperCase().includes(keyword.toUpperCase()) ||
                item.categorie[0].name.toUpperCase().includes(keyword.toUpperCase()) ||
                item.tags.includes(keyword.toUpperCase()))
        })

        res.status(200).send(filteredResult);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


const getArticleById = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await Article.findById({ _id: id });
        let categorie = await Categorie.findById({ _id: result.categorie });
       
        result.categorie = categorie;
  
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const getArticleBySlog = async (req, res) => {

    try {

        let { slog } = req.params;
        let article = await Article.findOne(
            { slog: slog, archived: false },    
            { title: 1, description: 1, date: 1, image: 1, slog: 1, content: 1, tags: 1, videoLink: 1, newsletter: 1, nbrViewsTotal: 1, fire: 1,categorie: 1 }
        );
        let categorie = await Categorie.findById({ _id: article.categorie });

        res.status(200).json({ article: article, categorie: categorie });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}



const deleteArticle = async (req, res) => {

    try {

        let { id } = req.params;
        const deletedArticle = await Article.findByIdAndDelete({ _id: id });
        res.status(200).send(deletedArticle);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const updateArticle = async (req, res, fileName) => {

    try {

        let { id } = req.params;
        let data = req.body;

        if(fileName.length > 0){
            data.image = fileName;
        }

        if(data.tags){
            data.tags = JSON.parse( data.tags )
        }
    
        let result = await Article.findByIdAndUpdate({ _id: id }, data);
        res.status(200).send(result);

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}

const archiveArticle = async (req, res) => {

    try {

        let { id } = req.params;
        console.log(id);
        let result = await Article.findByIdAndUpdate({ _id: id }, { archived: true });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const restoreArticle = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await Article.findByIdAndUpdate({ _id: id }, { archived: false });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const archiveListArticles = async (req, res) => {

    try {

        let result = await Article.find({ archived: true });
        console.log(result);
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const featuredArticle = async (req, res) => {

    try {

        let { id } = req.params;
        let { featured } = req.body;
        let result = await Article.findByIdAndUpdate({ _id: id }, { featured: featured });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const getFeaturedArticles = async (req, res) => {

    try {

        let result = await Article.aggregate([
            { $match: { featured: true, public: true } },
            { $sort: { eid: 1, modifyDate: 1 } },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categorie',
                    foreignField: '_id',
                    as: 'categorie'
                }
            }
        ])
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}





module.exports = {
    createArticle,
    existSlog,
    getPageArticles,
    getPageArticlesForClientSide,
    getArticlesTitles,
    getArticleById,
    getArticleBySlog,
    deleteArticle,
    updateArticle,
    searchArticles,
    archiveListArticles,
    restoreArticle,
    archiveArticle,
    featuredArticle,
    getFeaturedArticles,
    getArticleByCategorie
}