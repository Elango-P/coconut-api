/**
 * Module dependencies
 */
const { BAD_REQUEST, OK } = require("../../helpers/Response");

 // Services
 const { Attendance, User } = require("../../db").models;
 const Request = require("../../lib/request");

 /**
  * Customer get route
  */
 async function get(req, res, next){
     const { id } = req.params;
     const companyId = Request.GetCompanyId(req);

     try {

       

    const attendanceDetails = await Attendance.findOne({
        where: { id:id ,company_id:companyId },
        include : [
            {
                required: false,
                model: User,
                as: "user",
                attributes: ["name","media_url","last_name"]

            },
        ],
    });
     
    if (!attendanceDetails) {
        throw { message: "attendance not found", attendanceDetails };
    }

        
         // API response
         res.json({
             data: attendanceDetails
         });
     } catch (err) {
        console.log(err);
         res.json(BAD_REQUEST, {
             message: err.message
         });
     }
 };
 module.exports = get;