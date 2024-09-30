/**
 * User Details
 *
 * @param req
 * @param res
 */
function user(req, res) {
	res.json(req.user);
}

module.exports = user;
