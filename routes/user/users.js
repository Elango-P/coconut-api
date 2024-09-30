const users = module.exports = {
	REPORTER: -2,
	UNASSIGNED: -1,
	ADMIN: 41,
	UNASSIGNED_NAME: "Unassigned",

	getText: (userId) => {
		if (userId === users.UNASSIGNED) {
			return users.UNASSIGNED_NAME;
		}

		if (userId === users.ADMIN) {
			return "Admin";
		}

		return "";
	}
};
