const route = require("express").Router();
const AdminAuth = require('../middleware/admin-auth')
const superAdminAuth = require('../middleware/super-admin')
const ArticleM = require('../models/ArticleM')
const MessageM = require('../models/messageM')

const {getUsers,addPaymentTags,deletePaymentTag,getAllPaymentTags}=require('../controllers/admin')

route.get('/users',AdminAuth,getUsers)
route.post('/payment-tags',AdminAuth,addPaymentTags)
route.get('/payment-tags', AdminAuth, getAllPaymentTags)

route.get('/review/articles', AdminAuth, async (req, res) => {
    try {
        const articles = await ArticleM.find({}).sort({ createdAt: -1 });
        res.json(articles);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

route.get('/review/messages', AdminAuth, async (req, res) => {
    try {
        const messages = await MessageM.find({}).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

route.put('/publish/:id', superAdminAuth, async (req, res) => {
    try {
        const article = await ArticleM.findByIdAndUpdate(req.params.id,{publish:true})
        const message = await MessageM.findByIdAndUpdate(req.params.id,{publish:true})
        if(!message&&!article){
            return res.status(404).json({message:"Post does not exist"})
        }
        res.json({message:`${message?"Message":"Article"} published`})
    } catch (error) {
         res.status(400).json({message:error.message})   
    }
})

module.exports = route