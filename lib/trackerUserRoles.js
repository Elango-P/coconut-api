const roles = module.exports = {
	ADMIN: 1,
	DEVELOPER: 2,
	QA: 3,
	CUSTOMER: 4,
	CONSULTANT: 5,
	MANAGER: 6,
	EVALUATION: 7,
	LEAD: 8,
	SCRUM_MASTER: 9,

	getText: (role) => {
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
