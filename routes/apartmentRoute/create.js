/**
 * Module dependencies
 */
// Status
const { BAD_REQUEST, OK } = require("../../helpers/Response");

// Services
const apartmentService = require("../../services/ApartmentService");

/**
 * Apartment create route
 */
 async function create(req, res, next){
    const data = req.body;
    try {
        const createData = {
            name: data.name,
            status: data.status,
        };

        await apartmentService.createApartment(createData);

        res.json(201, {
            message:  "Apartment created",
        });
    } catch (err) {
        res.json(BAD_REQUEST, {
            message:  err.message,
        });
    }
};


module.exports = create;