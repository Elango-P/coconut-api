/**
 * Module dependencies
 */
const slug = require("slug");
const utils = require("../../lib/utils");
const { BAD_REQUEST, OK } = require("../../helpers/Response");
const { uploadFile } = require("../../lib/s3");
const Brand = require("../../helpers/Brand");

//systemLog
const History = require("../../services/HistoryService");

// Models
const { productBrand } = require("../../db").models;
const s3 = require("../../lib/s3");
const Request = require("../../lib/request");
/**
 * Route for upload brand image in S3
 */
 async function updateBrandingImage(req, res, next){
    const { id } = req.params;
    const { files: image } = req.files;
    let company_id = Request.GetCompanyId(req);
    // Validate brand id
    if (!id) {
        return res.json(BAD_REQUEST,{message: "Brand id is required"});
    }

    // Validate brand is exist or not
    const brandDetails = await productBrand.findOne({ where: { id } });
    if (!brandDetails) {
        return res.json(BAD_REQUEST,{message: "Brand not found"});
    }


    // Validate image type
    const imageType =image ? utils.getExtensionByType(image.type) : "";
    
    // Create image slug
    const mediaName = image ? `${slug(`${brandDetails.name}`, {
        lower: true,
    })}.${imageType}`: "";

    // S3 bucket path
    const imagePath = `${Brand.IMAGE_PATH}/${id}/${mediaName}`;
    try {
    // Upload image in S3
 image ? ( s3.uploadFile(image.path, imagePath,"", async err => {
        if (err) {
            return res.json(BAD_REQUEST,{message: err.message });
        }

    
            // Update image in brand table
            await productBrand.update({ image: mediaName }, { where: { id, company_id } });


        
    })) : 
    productBrand.update({ image: mediaName }, { where: { id, company_id } });
    
        // Update image in brand table
         

        History.create("Brand image updated", req);

        // API response
        return res.json(OK,{ message: "Brand image updated" }); 
    } catch (err) {
        console.log(err);
        return res.json(BAD_REQUEST,{ message: err.message });
    }
};

module.exports = updateBrandingImage;
