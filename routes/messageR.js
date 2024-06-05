const route = require("express").Router();
const authentication = require('../middleware/authentication')
const {
  addMessage, editSingleMessage, getMessages, getSingleMessage, deleteSingleMessage
} = require("../controllers/message");

route.post("/", authentication, addMessage);
route.get("/:id" , getSingleMessage);
route.delete("/:id", authentication, deleteSingleMessage);
route.put("/:id", authentication,editSingleMessage);
route.get("/all", getMessages);
//admin
route.get("/", getMessages);

module.exports = route;
