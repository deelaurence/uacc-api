const route = require("express").Router();
const {
    getMessages, getSingleMessage
} = require("../controllers/message");

route.get('/all', getMessages)
route.get('/:id', getSingleMessage)

module.exports = route