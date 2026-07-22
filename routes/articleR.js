const route = require("express").Router();
const AdminAuth = require("../middleware/admin-auth");
const authentication = require("../middleware/authentication");
const {
  addArticle,
  editSingleArticle,
  getArticles,
  deleteSingleArticle,
  getSingleArticle,
} = require("../controllers/article");

route.post("/", AdminAuth, addArticle);
route.get("/all", getArticles);
route.get("/:id", getSingleArticle);
route.put("/:id", AdminAuth, editSingleArticle);
route.delete("/:id", AdminAuth, deleteSingleArticle);
route.get("/", AdminAuth, getArticles);

module.exports = route;
