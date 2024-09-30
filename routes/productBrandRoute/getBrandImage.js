/**
 * Module dependencies
 */
const mime = require("mime-types");
const { BAD_REQUEST, OK } = require("../../helpers/Response");
const Brand =require("../../helpers/Brand");
// S3
const s3 = require("../../lib/s3");

/**
 * Route to get the brand image
 */
async function getBrandImage (req, res, next){
    try{
    const { id, mediaName } = req.params;

    // Validate brand id
    if (!id) {
        return res.json(BAD_REQUEST, {  message: "Brand id is required"});
    }

    // Validate brand mediaName
    if (!mediaName) {
        return res.json(BAD_REQUEST, {  message: "Media name is required"});
    }

    const imagePath = `${Brand.IMAGE_PATH}/${id}/${mediaName}`;
    s3.getFile(imagePath, (err, data) => {

        if (err) {
            return res.json(BAD_REQUEST, { message: err });
        }

        // Validate if data is null
        if (!data) {
            return res
                .json(BAD_REQUEST), { message: "File not found" };
        }

        res.writeHead(OK, {
            "Content-Type": mime.lookup(imagePath),
        });

        res.write(data.Body, "binary");

        res.end();
    })
  
 } catch(err){
    console.log(err);
    res.json(BAD_REQUEST, {  message: err.message});
 }

};

module.exports = getBrandImage;
