const route = require("express").Router();
const {
    getArticles, getSingleArticle
} = require("../controllers/article");

route.get('/all', getArticles)
route.get('/:id', getSingleArticle)

module.exports = route