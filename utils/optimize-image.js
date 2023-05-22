const sharp = require('sharp')
const processImage = async (buffer) => {
    try {
        // console.log(buffer, fileName)
        const converted = await sharp(buffer)
            // .resize(size, size)
            // .webp({ lossless: true })
            .webp({ quality: 80 })
            .toBuffer()
        return converted
        // .toFile(`./public/${fileName}.webp`);
    }
    catch (err) {
        console.log(err.message.slice(0, 100))
    }
}
module.exports = { processImage }        
