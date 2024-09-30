const { models: { UserProfileStatusHistory } } = require("../db");

module.exports = {
	/**
	 * Create User Profile Status History
	 *
	 * @param data
	 * @param callback
	 * @returns {PromiseLike<T | never> | Promise<T | never>}
	 */
	create: (data, callback) =>
		UserProfileStatusHistory
			.create({
				user_id: data.user_id,
				user_profile_status_id: data.user_profile_status_id
			})
			.then((userProfileStatusHistory) => callback(null, userProfileStatusHistory)).catch((err)=>{
				console.log(err);
			})
};
