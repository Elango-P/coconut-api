// utils
const { defaultDateFormat } = require( "../../lib/utils");

// import service
const { portalService } = require("../../services/PortalService");

//Models
const { Company } = require("../../db").models

async function getDetail (req, res, next) {
    try {
        const { id } = req.params;

        // Validate id
        if (!id) {
            return res.json(400, { message: "Portal id is required" });
        }

        try {
            const portalDetails = await portalService.findOne({
                where: { id },
                include: [
                    {
                        required: false,
                        model: Company,
                        attributes: ["company_name"],
                        as: "companyData",
                    },
                ],
                attributes: { exclude: ["deletedAt"] },
            });

            if (!portalDetails) {
                return res.json(400, { message: "Portal not found" });
            }

            const data = {
                id: portalDetails.id,
                portal_name: portalDetails.portal_name,
                portal_url: portalDetails.portal_url,
                template: portalDetails.template,
                company:
                    portalDetails.companyData &&
                    portalDetails.companyData.company_name,
                createdAt: defaultDateFormat(portalDetails.createdAt),
                updatedAt: defaultDateFormat(portalDetails.updatedAt),
            };

            res.json(200, data);
        } catch (err) {
            res.json(400, { message: err.message });
            next(err);
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports = getDetail