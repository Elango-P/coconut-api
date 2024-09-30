const validator = require("../../lib/validator");
const { Media } = require("../../db").models;
const { STRING } = require("sequelize");
const History = require("../../services/HistoryService");
const ObjectName = require("../../helpers/ObjectName");

function bulkDelete(req, res, next) {
    try {
        const ids = req.body;
        if (!ids) {
            return next(validator.validationError("Invalid Media Id"));
        }
        Media.destroy({ where: { id: (typeof (ids) == STRING) ? ids.split(",") : ids } })
            .then(() => {
                res.json({ message: "Media deleted" });
                res.on("finish", async () => {
                    History.create("Media deleted", req,ObjectName.MEDIA,ids);
                });
            })
            .catch((err) => {
                req.log.error(err);
                return next(err);
            });
    } catch (err) {
        console.log(err);
    }
}

module.exports = bulkDelete;
