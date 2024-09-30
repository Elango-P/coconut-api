// Model
const { Media } = require("../../db").models;

// Lib
const Request = require("../../lib/request");

const { getMediaUrl } = require("../../lib/utils");

async function GetDetail(req, res, next) {
    try {
        let { id } = req.params;

        const company_id = Request.GetCompanyId(req);

        if(!id) return res.send(404, { message: "Media Id required" });

        if(Number(id) == "NaN") return res.send(400, { message: "Invalid Id" });

        let mediaDetail = await Media.findOne({
            where: { id: Number(id), company_id }
        })

        if(!mediaDetail) return res.send(204, {message: "Data Not Found"});

        let data = { ...mediaDetail.get() };

        let { id: media_id, file_name } = data;

        data.url = file_name ? getMediaUrl(file_name, media_id) : null

        res.json(200, data)
    } catch(err) {
        next(err);
        console.log(err);
    }
}

module.exports = GetDetail;