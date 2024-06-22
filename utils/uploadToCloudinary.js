const cloudinary = require('cloudinary').v2;
const { processImage } = require('./optimize-image');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

const uploadImagesToCloudinary = async (pictures, model, modelId) => {
    const imageUrls = [];

    for (const picture of pictures) {
        try {
            let base64Data = picture.src;
            let fileName = picture.title.replace(/\s/g, '') + Date.now();
            const position = base64Data.indexOf(',');
            const extract = base64Data.slice(position + 1);
            const buffer = Buffer.from(extract, 'base64');
            const webpConverted = await processImage(buffer);
            const stringed = webpConverted.toString('base64');

            const cloudinary_response = await cloudinary.uploader.upload(`data:image/webp;base64,${stringed}`, { public_id: fileName });
            imageUrls.push(cloudinary_response.secure_url);

            // Update the model with the new image URL
            await model.findOneAndUpdate({ _id: modelId }, { "$push": { "image": cloudinary_response.secure_url } });
        } catch (error) {
            console.log(error.message.slice(0, 100));
        }
    }

    return imageUrls;
};

module.exports = { uploadImagesToCloudinary };
