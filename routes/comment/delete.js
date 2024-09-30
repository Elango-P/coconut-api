const CommentService = require("../../services/CommentService");
const del = async (req, res) => {
    await CommentService.delete(req, res);
};
module.exports = del;