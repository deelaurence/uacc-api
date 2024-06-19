const Author = require("../models/Authors");

// Create a new author
exports.createAuthor = async (req, res) => {
    try {
        const newAuthor = new Author(req.body);
        const savedAuthor = await newAuthor.save();
        res.status(201).json(savedAuthor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Edit an existing author
exports.editAuthor = async (req, res) => {
    try {
        const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedAuthor) {
            return res.status(404).json({ error: "Author not found" });
        }
        res.status(200).json(updatedAuthor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete an author
exports.deleteAuthor = async (req, res) => {
    try {
        const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
        if (!deletedAuthor) {
            return res.status(404).json({ error: "Author not found" });
        }
        res.status(200).json({ message: "Author deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all authors
exports.getAllAuthors = async (req, res) => {
    try {
        const authors = await Author.find();
        res.status(200).json(authors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
