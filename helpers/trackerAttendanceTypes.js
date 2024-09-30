const types = module.exports = {
	WORKING_DAY: 1,
	ADDITIONAL_DAY: 2,
	LEAVE: 3,
	ABSENT: 4,
	COMPENSATION_DAY: 5,
	NON_WORKING_DAY: 6,

	getText: (type) => {
		if (type === types.WORKING_DAY) {
			return "Working Day";
		}

		if (type === types.ADDITIONAL_DAY) {
			return "Additional Day";
		}

		if (type === types.LEAVE) {
			return "Leave";
		}

		if (type === types.ABSENT) {
			return "Absent";
		}

		if (type === types.COMPENSATION_DAY) {
			return "Compensation Day";
		}

		if (type === types.NON_WORKING_DAY) {
			return "Non Working Day";
		}

		return "";
	}
};
