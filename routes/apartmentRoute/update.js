/**
 * Module dependencies
 */
// Status
const { BAD_REQUEST, OK } = require("../../helpers/Response");

// Services
const apartmentService = require("../../services/ApartmentService");

/**
 * Store product update route
 */
async function update(req, res, next){
    const data = req.body;
    const { id } = req.params;

    try {
        const updateData = {
            name: data.name,
            status: data.status,
        };

        await apartmentService.updateApartmentById(id, updateData);

        res.json(OK, {
            message: "Apartment updated",
        });
    } catch (err) {
        res.json(BAD_REQUEST, {
            message: err.message,
        });
    }
};
module.exports = update;
