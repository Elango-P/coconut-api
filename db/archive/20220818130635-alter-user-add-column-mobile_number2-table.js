"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("user");
        if (tableDefinition && tableDefinition["mobile_number2"]) {
          queryInterface.changeColumn("user", "mobile_number2", {
              type: Sequelize.STRING,
          });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("user");

        if (tableDefinition && tableDefinition["mobile_number2"]) {
            await queryInterface.changeColumn("user", "mobile_number2", {
              type: Sequelize.INTEGER,
          });
        }
    },
};
