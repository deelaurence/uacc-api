const route = require("express").Router();
const {
  addMessage, editSingleMessage, getMessages, getSingleMessage, deleteSingleMessage
} = require("../controllers/message");

route.post("/", addMessage);
route.get("/:id", getSingleMessage);
route.delete("/:id", deleteSingleMessage);
route.put("/:id", editSingleMessage);
route.get("/all", getMessages);
//admin
route.get("/", getMessages);

module.exports = route;
