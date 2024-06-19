const mongoose = require("mongoose");


const AuthorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "please provide author's name"],
        },
        description: {
            type: String,
            required: [true, "Provide author's details"]
        },
    },
    { timestamps: true },

);

module.exports = mongoose.model("Authors", AuthorSchema);
