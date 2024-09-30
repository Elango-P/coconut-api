const CommentService = require("../../services/CommentService");
const search = async (req, res) => {
    await CommentService.search(req, res);
};
module.exports = search;