/**
 * Module dependencies
 */
const models = require("../../db/models");
const { BAD_REQUEST, OK } = require("../../helpers/Response");
const ArrayList = require("../../lib/ArrayList");
const Number = require("../../lib/Number");

// Models
const { UserRole, Shift, Location } = require("../../db").models;

/**
 * userRole get route by role_id
 */
async function get(req, res, next) {
    const { id } = req.params;

    // Validate role_id
    if (!id) {
        return res.json(BAD_REQUEST, { message: "role id is required", })
    }

    // Validate userRole is exist or not
    const userDetails = await UserRole.findOne({
        where: { id: id },
    });
    let shift = []

    let location = []

    let ipAddress = []

    if (userDetails.allowed_shifts) {
        let shifts = userDetails.allowed_shifts.split(",")
        if (shifts) {
            if(ArrayList.isArray(shifts.length)){
                for (let i = 0; i < shifts.length; i++) {
                    if(Number.isNotNull(shifts[i])){
                        let shiftsValue = await Shift.findOne({ where: { id: shifts[i] } })
                        const data = shiftsValue && shiftsValue.get()
                        shift.push({
                            id: data?.id,
                            name: data?.name,
                        })
                    }
                }
            }
        }
    }
    if (userDetails?.allowed_locations) {
        let locations = userDetails?.allowed_locations.split(",")
        if (locations) {
            for (let i = 0; i < locations.length; i++) {
                let locationsValue = await Location.findOne({ where: { id: locations[i] } })
                const data = locationsValue.get()
                location.push({
                    id: data.id,
                    name: data.name,
                })
            }
        }
    }
    if (userDetails.allowed_ip_address) {
        let ip_address = userDetails.allowed_ip_address.split(",");
        if (ip_address) {
            for (let i = 0; i < ip_address.length; i++) {
                ipAddress.push({
                    label: ip_address[i],
                    value: ip_address[i]
                });
            }
        }
    }


    if (!userDetails) {
        return res.json(BAD_REQUEST, { message: "role not found", })
    }
    // API response
    res.json(OK, {
        data: {
            role_name: userDetails.role_name,
            status: userDetails.status,
            allowed_shifts: shift,
            allowed_location: location,
            allowed_ip_address: ipAddress
        },
    })
};

module.exports = get;
