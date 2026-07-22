const route = require("express").Router();
const publicOnly = require("../middleware/public-only");
const { getArticles, getSingleArticle } = require("../controllers/article");

route.get("/all", publicOnly, getArticles);
route.get("/:id", publicOnly, getSingleArticle);

module.exports = route;
