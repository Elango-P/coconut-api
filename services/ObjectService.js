const {BAD_REQUEST, OK} = require('../helpers/Response');
const DateTime = require('../lib/dateTime');
const Request = require("../lib/request");
const {objectModel} = require('../db').models;


const search = async (req, res) => {

    let company_id = Request.GetCompanyId(req);

    const query = {
        attributes: ["id", "name", "createdAt", "updatedAt"],
        where:{
            company_id
        }
    };

    try {
        // Get object list and count
        const objectLists = await objectModel.findAndCountAll(query);

        // Return object is null
        if (objectLists.count === 0) {
            return res.json({});
        }

        const data = [];
        objectLists.rows.forEach(list => {

            const {id, name, createdAt, updatedAt} = list.get();

            data.push({id, name, createdAt: DateTime.defaultDateFormat(createdAt), updatedAt: DateTime.defaultDateFormat(updatedAt)});
        });

        res.json(OK, {
            totalCount: objectLists.count,
            data
        })
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, {message: err.message});
    }
};

module.exports = {
    search,
}
