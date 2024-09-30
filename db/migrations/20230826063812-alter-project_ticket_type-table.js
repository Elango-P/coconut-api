'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("project_ticket_type");
    if (tableDefinition && !tableDefinition["default_assignee"]) {
      await queryInterface.addColumn("project_ticket_type", "default_assignee", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("project_ticket_type");
    if (tableDefinition && tableDefinition["default_assignee"]) {
      await queryInterface.removeColumn("project_ticket_type", "default_assignee");
    }
  },
};
