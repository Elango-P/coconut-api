'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("candidate");
    if (tableDefinition && !tableDefinition["media_id"]) {
      await queryInterface.addColumn("candidate", "media_id", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("candidate");
    if (tableDefinition && tableDefinition["media_id"]) {
      await queryInterface.removeColumn("candidate", "media_id");
    }
  },
};