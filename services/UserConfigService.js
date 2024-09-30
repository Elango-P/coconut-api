const { UserConfig } = require("../db").models;

module.exports = {
    /**
     * Get User Config Detail by UserId
     * @param {*} userId 
     * @param {*} callback 
     * @returns 
     */
     getUserConfigDetailByUserId: (userId, name, callback) => {
        try{ 
        if (!userId && !name) {
            return callback();
        }

        UserConfig.findOne({
            attributes: ["id", "name", "value"],
            where: { user_id: userId, name }
        }).then((userConfigDetails) => {
            if (!userConfigDetails) {
                return callback();
            }

            return callback(null, userConfigDetails.value);
        });
    } catch (err){
        console.log(err);
    }
    }
};