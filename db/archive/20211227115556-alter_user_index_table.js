"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      const tableDefinition = await queryInterface.describeTable("user_index");
        try {
          if(tableDefinition){
            await queryInterface.renameTable(
                "user_index",
                "dashboard_index"
            );
          }

        } catch (err) {
            console.log(err);
        }
    },

    down: async (queryInterface, Sequelize) => {
    },
};
