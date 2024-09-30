
const Request = require("../../lib/request");
const { Wishlist } = require("../../db").models;

const del = async (req, res) => {
    try {
        //get company Id from request
        let wishlistId = req.params.id;

        //get company Id from request
        const companyId = Request.GetCompanyId(req);

        //validate stock entry Id exist or not
        if (!wishlistId) {
            return res.json(400, { message: "Wishlist Id is required" });
        }

        //delete stock entry
        await Wishlist.destroy({where : { id : wishlistId, company_id: companyId}});

        res.json(200, { message: "Wishlist Deleted" });
    } catch (err) {
        return res.json(400, { message: err.message });
    }
}

module.exports = del;