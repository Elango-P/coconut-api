"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("user");
        if (tableDefinition && tableDefinition["mobile_number1"]) {
          queryInterface.changeColumn("user", "mobile_number1", {
              type: Sequelize.STRING,
          });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("user");

        if (tableDefinition && tableDefinition["mobile_number1"]) {
            await queryInterface.changeColumn("user", "mobile_number1", {
              type: Sequelize.INTEGER,
          });
        }
    },
};
