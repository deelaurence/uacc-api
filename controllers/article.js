const cloudinary = require('cloudinary').v2;
const { processImage } = require('../utils/optimize-image')
const fs = require('fs')
require("dotenv").config();
const {readMinutes}=require('../utils/readMinutes')
const Article = require("../models/ArticleM");
const Withdrawal = require("../models/WithdrawalM");
const Admin = require("../models/AdminAuth")
const User = require("../models/UserModel")
const { v4: uuidv4 } = require('uuid');
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors/customErrors");
const articleM = require('../models/ArticleM');
let uniqueId = 0
const {getCurrentDateString}=require('../utils/date')


const addArticle = async (req, res) => {
    console.log(1)
    console.log(req.body)
    try {
        uniqueId++
        let day = new Date().getDate()
        let month = new Date().getMonth()
        let year = new Date().getFullYear()
        const date = `${day}-${month + 1}-${year}`
        req.body.owner = req.decoded.id;
       
        req.body.date = date;
        req.body.id = uuidv4();
        req.body.reference = "#" + req.decoded.name.slice(0, 3) + "/" + uuidv4()
        const admin = await Admin.findOne({ _id: req.decoded.id })
        if (!admin) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "admin not found" })
        }
        console.log(1.1)
        req.body.day=getCurrentDateString()
        req.body.filterId = admin.id
        req.body.filterName = admin.name
        req.body.author = admin.name
        req.body.paragraphOne = req.body.paragraphOne.replace(/\n/g, '<br/>')
        if (req.paragraphTwo) {
            req.body.paragraphTwo = req.body.paragraphTwo.replace(/\n/g, '<br/>')
        }
        if (req.paragraphThree) {
            req.body.paragraphThree = req.body.paragraphThree.replace(/\n/g, '<br/>')
        }

        let _readMinutes = readMinutes(
            req.body.paragraphOne,req.body.paragraphTwo,req.body.paragraphThree
        )
        
        req.body.readMinutes=_readMinutes
        const newArticle = await Article.create(req.body)
        
        const getPopulated = await Article.findOne({ _id: newArticle._id }).populate({ path: "owner", model: "Admin" });
        
        const {unsplashPictures} = req.body
        if(unsplashPictures[0]){
            unsplashPictures.forEach(async(picture)=>{
                await Article.findOneAndUpdate({ _id:newArticle._id }, { "$push": { "image": picture } });
            })
        }
        
        req.body.pictures.forEach(async (picture, index) => {
            try {
                console.log(2)
                let base64Data = picture.src
                let fileName = picture.title.replace(/\s/g, '') + Date.now()
                const position = base64Data.indexOf(',')
                const extract = base64Data.slice(position + 1)
                const buffer = Buffer.from(extract, "base64");
                const webpConverted = await processImage(buffer)
                console.log(3);
                const stringed = webpConverted.toString('base64');
                // console.log(buffer)
                // Configuration 
                // console.log(webpConverted)
                // console.log(stringed.slice(0, 100))
                // console.log(base64Data.slice(0, 100))
                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret
                });
                const cloudinary_response = cloudinary.uploader.upload(`data:image/webp;base64,${stringed}`, { public_id: fileName })
                console.log(4)
                cloudinary_response.then(async ({ secure_url }) => {
                    console.log(secure_url);
                    const includeUrl = await Article.findOneAndUpdate({ _id:newArticle._id }, { "$push": { "image": secure_url } });

                    console.log("index is--" + index)
                    console.log("updated image field to " + includeUrl.image)

                    console.log(5)
                    console.log("image field" + req.body.image)
                    console.log(secure_url);
                }).catch((err) => {
                    console.log(err.message.slice(0, 100));
                    console.log(err);
                });


                // Generate 
                const url = cloudinary.url(fileName, {
                    width: 100,
                    height: 150,
                    Crop: 'fill'
                });

                req.body.image = url
                console.log("index is--" + index)
                console.log(5)

                // The output url

            } catch (error) {
                console.log(error)
                // res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
            }
        })
        console.log(6)
    res.json({message:"article posted"})

    } catch (error) {
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};


const editSingleArticle = async (req, res) => {
    try {
        console.log(req.body)
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const articleId = req.params.id
        const { 
            writer,
            title, 
            paragraphOne, 
            paragraphTwo, 
            paragraphThree, 
            headingOne, 
            headingTwo, 
            headingThree, 
            pointOne, 
            pointTwo, 
            pointThree, 
            pointFour, 
            pointFive, 
            pointSix, 
            pointSeven, 
            pointEight, 
            pointNine, 
            pointTen, 
            quoteOne, 
            quoteTwo,
            image, 
            pictures,
            unsplashPictures,
            quoteThree } = req.body
            
        const singleArticle = await Article.findOneAndUpdate({
            _id: articleId
        }, { writer, image:unsplashPictures||pictures, title, paragraphOne, paragraphTwo, paragraphThree, headingOne, headingTwo, headingThree, pointOne, pointTwo, pointThree, pointFour, pointFive, pointSix, pointSeven, pointEight, pointNine, pointTen, quoteOne, quoteTwo, quoteThree })
        res.status(StatusCodes.OK).json(singleArticle)
        
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
}

const deleteSingleArticle = async (req, res) => {
    try {

        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const articleId = req.params.id
        const { writer, title, paragraphOne, paragraphTwo, paragraphThree, headingOne, headingTwo, headingThree, pointOne, pointTwo, pointThree, pointFour, pointFive, pointSix, pointSeven, pointEight, pointNine, pointTen, quoteOne, quoteTwo, quoteThree } = req.body
        const singleArticle = await Article.findOneAndDelete({
            id: articleId
        })
        res.status(StatusCodes.OK).json(singleArticle)
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
}


const getSingleArticle = async (req, res) => {
    try {
        const articleId = req.params.id
        let query = {
            _id: articleId,
        }
        //admin requests have req.decoded
        if (req.decoded) {
            query = { id: articleId }
        }
        const singleArticle = await Article.findOne(query).populate({ path: "owner", model: "user" });
        if (!singleArticle) {
            throw new NotFound(
                `no Article with id ${articleId} `
            );
        }
        res.status(StatusCodes.OK).json(singleArticle);
    } catch (error) {
        console.log(error.message)
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};
const getArticles = async (req, res) => {
    try {
        let query = {}
        console.log(req.decoded)
        //Requests coming from admin passses thru middleware
        if (req.decoded) {
            query = { owner: req.decoded.id }
        }


        const allArticles = await Article.find(query)
            .sort({ createdAt: -1 })
        // .skip(pageOptions.page * pageOptions.limit)
        // .limit(pageOptions.limit);
        if (allArticles.length < 1) {
            throw new NotFound("No Articles found");
        }
        res
            .status(StatusCodes.OK)
            .json(allArticles);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        console.log(error.message);
    }
};



module.exports = { addArticle, editSingleArticle, getArticles, getSingleArticle, deleteSingleArticle }