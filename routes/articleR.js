const route = require("express").Router();
const authentication = require('../middleware/authentication')
const {
    addArticle, editSingleArticle, getArticles, deleteSingleArticle, getSingleArticle
} = require("../controllers/article");

route.post("/", authentication, addArticle);
route.get("/:id",  getSingleArticle);
route.put("/:id", authentication, editSingleArticle);
route.delete("/:id", authentication, deleteSingleArticle);
route.get("/all", getArticles);
//admin
route.get("/", getArticles);

module.exports = route;
