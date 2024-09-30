"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("project");
    if (tableDefinition && tableDefinition["last_ticket_number"]) {
      await queryInterface.changeColumn("project", "last_ticket_number", {
        type:  'INTEGER USING CAST("last_ticket_number" as INTEGER)',
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("project");
    if (tableDefinition && tableDefinition["."]) {
      await queryInterface.changeColumn("project", "last_ticket_number", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
