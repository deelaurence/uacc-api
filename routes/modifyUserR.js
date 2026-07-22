const route = require("express").Router();
const authentication = require("../middleware/authentication");
const { editUser, deleteUser } = require("../controllers/modifyUserC");

route.put("/edit-user", authentication, editUser);
route.delete("/delete-user/:id", authentication, deleteUser);

module.exports = route;
