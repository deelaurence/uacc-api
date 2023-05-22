const route = require("express").Router();
const {
    addArticle, editSingleArticle, getArticles, deleteSingleArticle, getSingleArticle
} = require("../controllers/article");

route.post("/", addArticle);
route.get("/:id", getSingleArticle);
route.put("/:id", editSingleArticle);
route.delete("/:id", deleteSingleArticle);
route.get("/all", getArticles);
//admin
route.get("/", getArticles);

module.exports = route;
