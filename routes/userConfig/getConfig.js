// Models
const { UserConfig } = require("../../db").models;

function get(user_id, callback) {
	UserConfig
		.findAll({
			attributes: ["name", "value"],
			where: { user_id }
		})
		.then((configs) => {
			const configKeys = {};

			if (configs) {
				configs.forEach((config) => {
					configKeys[config.name] = config.value;
				});
			}

			return callback(null, configKeys);
		});
}

module.exports = get;
