'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("project_ticket_type");
    if (tableDefinition && !tableDefinition["default_story_point"]) {
      await queryInterface.addColumn("project_ticket_type", "default_story_point", {
          type: Sequelize.DECIMAL,
          allowNull: true,
    
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("project_ticket_type");
    if (tableDefinition && tableDefinition["default_story_point"]) {
      await queryInterface.removeColumn("project_ticket_type", "default_story_point");
    }
  },
};