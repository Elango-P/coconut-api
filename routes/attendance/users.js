const { User } = require("../../db").models;

function users(req, res) {
	User
		.findAll({
			attributes: ["id", "name"]
		})
		.then((userList) => {
			const results = [];
			userList.forEach((user) => {
				user = user.get();
				results.push(user);
			});

			res.json(results);
		});
}

module.exports = users;
