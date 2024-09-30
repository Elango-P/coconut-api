// utils
const { COMPANY } = require("../../helpers/ObjectName");
const Request = require("../../lib/request");
const { defaultDateFormat, getUserMediaUrl } = require("../../lib/utils");
const { getMediaUrl } = require("../../lib/utils");

// import service
const { companyService } = require("../../services/CompanyService");
const { Media } = require("../../db").models;

async function get(req, res, next) {
    try {

        const { company_id } = req.query;

        const id = company_id ? company_id : Request.GetCompanyId(req);
        
        // Validate id
        if (!id) {
            return res.json(400, { message: "Company id is required" });
        }

        try {
            const companyDetails = await companyService.findOne({
                where: { id },
                attributes: { exclude: ["deletedAt"] },
            });

            const companyData = await Media.findOne({
                where: {
                    object_id: companyDetails.id,
                    object_name: COMPANY
                },
            });

            if (!companyDetails) {
                return res.json(400, { message: "Company not found" });
            }

            const data = {
                id: companyDetails.id,
                company_name: companyDetails.company_name,
                time_zone : companyDetails.time_zone,
                status: companyDetails.status ? companyDetails.status : "",
                websiteurl: companyDetails.websiteurl,
                description: companyDetails.description,
                email: companyDetails.email,
                mobileNumber1: companyDetails.mobile_number1,
                mobileNumber2: companyDetails.mobile_number2,
                address1: companyDetails.address1,
                address2: companyDetails.address2,
                city: companyDetails.city,
                state: companyDetails.state,
                country: companyDetails.country,
                gst_number: companyDetails.gst_number,
                pin_code: companyDetails.pin_code,
                facebook_url: companyDetails.facebook_url,
                instagram_url: companyDetails.instagram_url,
                twitter_url: companyDetails.twitter_url,
                linkedIn_url: companyDetails.linkedIn_url,
                youtube_url: companyDetails.youtube_url,
                portal_url: companyDetails.portal_url,
                portal_api_url: companyDetails.portal_api_url,
                template: companyDetails.template,
                createdAt: defaultDateFormat(companyDetails.createdAt),
                updatedAt: defaultDateFormat(companyDetails.updatedAt),
            };

            if (companyData && companyData.file_name && companyData.id) {
                data.company_logo = getMediaUrl(companyData.file_name ? companyData.file_name : "", companyData.id),
                    data.media_id = companyData.id ? companyData.id : ""
            }
            res.json(200, data);
        } catch (err) {
            res.json(400, { message: err.message });
            next(err);
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = get;