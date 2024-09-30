/**
 * Module dependencies
 */
const {
    BAD_REQUEST,
    CREATE_SUCCESS,
} = require("../../helpers/Response");

// Services
const service = require("../../services/LocationService");

//systemLog
const History = require("../../services/HistoryService");
const {StoreUser } = require("../../db").models;

/**
 * Location create route
 */
async function create(req, res, next) {
   

    let companyId = req.user && req.user.company_id;
    const data = req.body;
    const {id} = req.params;
    if (!companyId) {
        return res.send(404, { message: "Company Id Not Found" })
    }

    const { user,shift, status } = data;

    try {
     let isExist = await StoreUser.findOne({
            where: { store_id: id, user_id: data.user , shift_id : data.shift  },
          });;
        if (isExist) {
            return res.json(BAD_REQUEST, { message: "Location User Already Exist", })
        }

        const createData = { 
          store_id: id,  user_id: user, shift_id : shift, status :status, company_id: companyId };

        // Create Location
        await  StoreUser.create(createData);

        // API response
        res.json(CREATE_SUCCESS, { message: "Location User Created", });

        res.on("finish", async () => {
            // Create system log for store creation
            History.create(`Location User Created`, req);
        });
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message, })
    }
};
module.exports = create;
