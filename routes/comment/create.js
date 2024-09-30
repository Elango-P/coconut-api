const CommentService = require("../../services/CommentService");
const create = async (req, res) => {
    await CommentService.create(req, res);
};
module.exports = create;