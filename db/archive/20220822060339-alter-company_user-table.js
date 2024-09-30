"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      const tableDefinition = await queryInterface.describeTable("portal_user");
        try {
          if(tableDefinition){
            await queryInterface.renameTable(
                "portal_user",
                "company_user"
            );
          }

        } catch (err) {
            console.log(err);
        }
    },

    down: async (queryInterface, Sequelize) => {
    },
};
