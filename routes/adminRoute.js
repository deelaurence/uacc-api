const route = require("express").Router();
const AdminAuth = require('../middleware/admin-auth')
route.use(AdminAuth)

const {getUsers,addPaymentTags,deletePaymentTag,getAllPaymentTags}=require('../controllers/admin')

route.get('/users',getUsers)
route.post('/payment-tags',addPaymentTags)
route.get('/payment-tags',getAllPaymentTags)
route.delete('/payment-tags/:id',deletePaymentTag)




module.exports = route