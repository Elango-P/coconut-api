/**
 * Module dependencies
 */
const ObjectName = require("../../helpers/ObjectName");
const { BAD_REQUEST, UPDATE_SUCCESS } = require("../../helpers/Response");
const Request = require("../../lib/request");
const validator = require("../../lib/validator");

// Models
const { UserRole } = require("../../db").models;

//systemLog
const History = require("../../services/HistoryService");
const UserRoleService = require("../../services/UserRoleService");

/**
 * UserRole update route
 */
async function update(req, res, next) {
    const data = req.body;
    let companyId = Request.GetCompanyId(req)
    const { id } = req.params;
    const name = data?.role_name;
    const status = data?.status;
    try {

        if(validator.isKeyAvailable(req.body,"role_name")){
            const isRoleAlreadyExite = await UserRoleService.isNameExist(name.trim(),companyId,status)
    
            if(isRoleAlreadyExite){
                return res.json(400,{message:"Role Name Already Exist"})
            }
        }

        const useDetail = await UserRole.findOne({
            where: { id, company_id: companyId },
        });
        const shift = []
        const ip_address = []
        const locations = []

        if (data?.allowedShifts) {
            JSON.parse(data?.allowedShifts).forEach((data) => {
                shift.push(data.value)
            })
        }

        if (data?.allowed_ip_address) {
            JSON.parse(data?.allowed_ip_address).forEach((data) => {
                ip_address.push(data.value)
            })
        }
        if (data?.allowed_location) {
            JSON.parse(data?.allowed_location).forEach((data) => {
                locations.push(data.id)
            })
        }

        //update userRole details
        const userRoleDetails = {
            role_name: name,
            status: data && data.status ? data.status : data,
            allowed_shifts: shift.join(",") || null,
            allowed_locations: locations.join(",") || null,
            allowed_ip_address: ip_address.join(",") || null,
        };

        let auditLogMessage = new Array();
        if (useDetail && useDetail?.status !== status) {
          auditLogMessage.push(`Status Changed to ${status}\n`);
        }
        if (useDetail && name !== undefined && useDetail?.role_name !== name) {
          auditLogMessage.push(`Role Name Changed to ${name}\n`);
        }

        const save = await useDetail.update(userRoleDetails);

        // API response
        res.json(UPDATE_SUCCESS, { message: "UserRole Updated", data: save.get(), })
        res.on("finish", async () => {
            if (auditLogMessage && auditLogMessage.length > 0) {
                let message = auditLogMessage.join();
                History.create(message, req, ObjectName.ROLE, id);
            } else {
                History.create("User Role Updated", req, ObjectName.ROLE, id);
            }
        });
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message, })
    }
};

module.exports = update;
