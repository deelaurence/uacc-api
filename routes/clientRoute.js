const route = require("express").Router();
const publicOnly = require("../middleware/public-only");
const { getMessages, getSingleMessage } = require("../controllers/message");

route.get("/all", publicOnly, getMessages);
route.get("/:id", publicOnly, getSingleMessage);

module.exports = route;
