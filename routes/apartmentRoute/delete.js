/**
 * Module dependencies
 */
// Status
const { BAD_REQUEST, CREATE_SUCCESS } =require("../../helpers/Response");

// Services
const apartmentService = require("../../services/ApartmentService");

/**
 * Apartment delete route
 */
  async function Delete(req, res, next){
    const { id } = req.params;

    try {
        await apartmentService.deleteApartment(id);

        res.json(201, {
            message:  "Apartment deleted",
        });
    } catch (err) {
        res.json(BAD_REQUEST, {
            message:  err.message,
        });
    }
};
module.exports = Delete;