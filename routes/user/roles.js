const roles = module.exports = {
	SUPER_ADMIN: 1,
	ADMIN: 2,
	DEVELOPER: 3,
	QA: 4,
	CUSTOMER: 5,
	CONSULTANT: 6,
	MANAGER: 7,
	EVALUATION: 8,
	LEAD: 9,
	SCRUM_MASTER: 10,

	getText: (role) => {
		if (role === roles.SUPER_ADMIN) {
			return "Super Admin";
		}

		if (role === roles.ADMIN) {
			return "Admin";
		}

		if (role === roles.DEVELOPER) {
			return "Developer";
		}

		if (role === roles.QA) {
			return "QA";
		}

		if (role === roles.CUSTOMER) {
			return "Customer";
		}

		if (role === roles.CONSULTANT) {
			return "Consultant";
		}

		if (role === roles.MANAGER) {
			return "Manager";
		}

		if (role === roles.EVALUATION) {
			return "Evaluation";
		}

		if (role === roles.LEAD) {
			return "Lead";
		}

		if (role === roles.SCRUM_MASTER) {
			return "Scrum Master";
		}

		return "";
	}
};
