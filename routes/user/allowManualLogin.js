const AllowManualLogin = module.exports = {
	NO: 0,
	YES: 1,

	getText: (allowManualLogin) => {
		if (allowManualLogin === AllowManualLogin.NO) {
			return "No";
		}

		if (allowManualLogin === AllowManualLogin.YES) {
			return "Yes";
		}
		return "";
	}
};
