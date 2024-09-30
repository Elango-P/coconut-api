// Models
const { ActivityType } = require("../../db").models;

function getActivityTypes(req, res) {

	ActivityType
		.findAll({
			attributes: ["id", "name", "user_roles"],
			where: [`FIND_IN_SET(${req.user.role}, user_roles)`]
		})
		.then((activityTypes) => {
			const severities = [];
			activityTypes.forEach((activityType) => {
				activityType = activityType.get();
				severities.push({
					value: activityType.id,
					label: activityType.name,
					title: activityType.name
				});
			});
			res.json(severities);

		});
};
module.exports = getActivityTypes;
