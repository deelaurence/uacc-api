const route = require("express").Router();
const AdminAuth = require('../middleware/admin-auth')


const {getUsers,addPaymentTags,deletePaymentTag,getAllPaymentTags}=require('../controllers/admin')

route.get('/users',AdminAuth,getUsers)
route.post('/payment-tags',AdminAuth,addPaymentTags)
route.get('/payment-tags',getAllPaymentTags)
route.delete('/payment-tags/:id',AdminAuth,deletePaymentTag)

module.exports = route