"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      const tableDefinition = await queryInterface.describeTable("index_dashboard");
        try {
          if(tableDefinition){
            await queryInterface.renameTable(
                "index_dashboard",
                "user_index"
            );
          }

        } catch (err) {
            console.log(err);
        }
    },

    down: async (queryInterface, Sequelize) => {
    },
};
