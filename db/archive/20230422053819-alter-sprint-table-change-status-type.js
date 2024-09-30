"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("sprint");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.changeColumn("sprint", "status", {
        type:  'INTEGER USING CAST("status" as INTEGER)',
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("sprint");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.changeColumn("sprint", "status", {

        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },
};