"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && tableDefinition["next_status_id"]) {
      await queryInterface.changeColumn("status", "next_status_id", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && tableDefinition["next_status_id"]) {
      await queryInterface.changeColumn("status", "next_status_id", {

        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
