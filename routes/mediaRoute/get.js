const mime = require("mime-types");

/**
 * Module dependencies
 */
const { BAD_REQUEST, OK } = require("../../helpers/Response");
// S3
const s3 = require("../../lib/s3");
const DataBaseService = require("../../lib/dataBaseService");
const Request = require("../../lib/request");
const {  Media: MediaModal } = require("../../db").models;
const MediaService = new DataBaseService(MediaModal);

/**
 * Route to get the product image
 */
async function getProductImage(req, res, next) {
    try {
        const { id } = req.params;
        let mediaDetail = await MediaService.findOne({
            where: { id: id}
        })
        // Validate product id
        if (!id) {
            return res.json(BAD_REQUEST, { message: "Product id is required", });
        }

        // Validate media name
        if (!mediaDetail.dataValues.file_name) {
            return res.json(BAD_REQUEST, { message: "Media Name is required", });
        }

        const imagePath = `${id}-${mediaDetail.dataValues.file_name}`;

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
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message });

    }

};
module.exports = getProductImage;
