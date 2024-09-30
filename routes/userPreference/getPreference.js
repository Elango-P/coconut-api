// Models
const { UserPreference } = require("../../db").models;

function getPreference(req, res) {
	UserPreference
		.findOne({
			attributes: ["key", "value"],
			where: { user_id: req.user.id, key: req.params.key }
		})
		.then((userPreferences) => {
			res.json(userPreferences);
		});
}

module.exports = getPreference;
