"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("activity_type");
    if (tableDefinition && tableDefinition["default_status"]) {
      await queryInterface.changeColumn("activity_type", "default_status", {
        type: 'INTEGER USING CAST("default_status" as INTEGER)',
        allowNull: true,
      });
    }

  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("activity_type");
    if (tableDefinition && tableDefinition["default_status"]) {
      await queryInterface.changeColumn("activity_type", "default_status", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

  },
};
