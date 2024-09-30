const forceupdated = module.exports = {
	DISABLE: 0,
	WITHOUTDATE: 1,
	WITHDATE: 2,

	getText: (forceDailyUpdate) => {
		if (forceDailyUpdate === forceupdated.DISABLE) {
			return "Disable";
		}

		if (forceDailyUpdate === forceupdated.WITHOUTDATE) {
			return "Without Date";
		}

		if (forceDailyUpdate === forceupdated.WITHDATE) {
			return "With Date";
		}

		return "";
	}
};
