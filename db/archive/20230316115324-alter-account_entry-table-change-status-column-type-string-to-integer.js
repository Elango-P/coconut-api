"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("account_entry");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.changeColumn("account_entry", "status", {
        type:  'INTEGER USING CAST("status" as INTEGER)',
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("account_entry");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.changeColumn("account_entry", "status", {

        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
