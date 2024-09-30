const { UserPreference } = require("../../db").models;

function list(req, res) {
	UserPreference
		.findAll({
			attributes: ["key", "value"],
			where: { user_id: req.user.id }
		})
		.then((userPreferences) => {
			res.json(userPreferences);
		});
};

module.exports = list;
