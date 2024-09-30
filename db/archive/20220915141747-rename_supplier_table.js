"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      const tableDefinition = await queryInterface.describeTable("supplier");
        try {
          if(tableDefinition){
            await queryInterface.renameTable(
                "supplier",
                "vendor"
            );
          }

        } catch (err) {
            console.log(err);
        }
    },

    down: async (queryInterface, Sequelize) => {
    },
};
