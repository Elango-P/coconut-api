/**
 * Module dependencies
 */
const { shift } = require("to-textile/lib/tex-converters");
const models = require("../../db/models");
const { BAD_REQUEST, OK } = require("../../helpers/Response");
const StoreUserStatus = require("../../helpers/StoreUserStatus");
const Request = require("../../lib/request");

// Models
const { StoreUser ,Shift } = require("../../db").models;

/**
 * Tag get route by tag id
 */
 async function get(req, res, next){
    try{
    const { id } = req.params;
    let company_id = Request.GetCompanyId(req)
    // Validate tag id
    if (!id) {
        return res.json(BAD_REQUEST, { message :  "Location User id is required" ,})
    }

    // Validate tag is exist or not
    const storeUserDetails = await StoreUser.findOne({
        where: { id, company_id },
    });
   
    const shiftDetails = await Shift.findOne({
        where: { id : shift_id, company_id}
    })
    // API response
    res.json(OK, {
        data: {
            id,
            name: storeUserDetails.name,
            status: storeUserDetails.status === StoreUserStatus.ACTIVE ?StoreUserStatus.STATUS_ACTIVE_TEXT : StoreUserStatus.STATUS_INACTIVE_TEXT,
            shift:shiftDetails.name
        },
    })
}catch(err){
    console.log(err);
}
};

module.exports = get;
