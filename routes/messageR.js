const route = require("express").Router();
const AdminAuth = require("../middleware/admin-auth");
const {
  addMessage,
  editSingleMessage,
  getMessages,
  getSingleMessage,
  deleteSingleMessage,
} = require("../controllers/message");

route.post("/", AdminAuth, addMessage);
route.get("/all", getMessages);
route.get("/:id", getSingleMessage);
route.put("/:id", AdminAuth, editSingleMessage);
route.delete("/:id", AdminAuth, deleteSingleMessage);
route.get("/", AdminAuth, getMessages);

module.exports = route;
