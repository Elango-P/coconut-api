const StatusActive = module.exports = {
	ACTIVE: 1,
	INACTIVE: 0,

	getText: (active) => {
		if (active === StatusActive.ACTIVE) {
			return "Active";
		}

		if (active === StatusActive.INACTIVE) {
			return "Inactive";
		}

		return "";
	}
};
