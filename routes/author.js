const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authors");

// Route to create a new author
router.post("/", authorController.createAuthor);

// Route to edit an existing author
router.put("/:id", authorController.editAuthor);

// Route to delete an author
router.delete("/:id", authorController.deleteAuthor);

// Route to get all authors
router.get("/", authorController.getAllAuthors);

module.exports = router;
