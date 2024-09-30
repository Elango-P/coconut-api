// Status
const { BAD_REQUEST, OK } = require("../../helpers/Response");

// Services
const storeProductMediaService = require("../../services/MediaService");

 async function search (req, res, next){
    const params = req.query;
 try {
        const data = await storeProductMediaService.searchProductMedia(
            params
        );
        res.json(OK, data );
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message : err.message,});
    }
};

module.exports = search;
