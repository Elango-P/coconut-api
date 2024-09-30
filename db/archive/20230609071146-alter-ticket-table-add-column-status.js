'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("ticket");
    if (tableDefinition && !tableDefinition["status"]) {
      await queryInterface.addColumn("ticket", "status", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("ticket");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.removeColumn("ticket", "status");
    }
  },
};
