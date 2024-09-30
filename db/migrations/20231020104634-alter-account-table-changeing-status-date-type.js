"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("account");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.changeColumn("account", "status", {
        type:  'INTEGER USING CAST("status" as INTEGER)',
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("account");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.changeColumn("account", "status", {

        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
