const CommentService = require("../../services/CommentService");
const update = async (req, res) => {
    await CommentService.update(req, res);
};
module.exports = update;