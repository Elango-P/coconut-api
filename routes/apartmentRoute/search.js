// Status
const  { BAD_REQUEST, OK } = require("../../helpers/Response");

// Services
const apartmentService =  require("../../services/ApartmentService");

 async function search (req, res, next){
    const params = req.query;

    try {
        const data = await apartmentService.searchApartment(params);
        res.json(data);
    } catch (err) {
        res.json(BAD_REQUEST, {
            message : err.message,
        });
    }
};

module.exports = search;
