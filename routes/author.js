const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authors");
const AdminAuth = require("../middleware/admin-auth");

router.post("/", AdminAuth, authorController.createAuthor);
router.put("/:id", AdminAuth, authorController.editAuthor);
router.delete("/:id", AdminAuth, authorController.deleteAuthor);
router.get("/", authorController.getAllAuthors);

module.exports = router;
