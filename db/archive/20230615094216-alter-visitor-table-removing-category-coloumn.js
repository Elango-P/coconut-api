'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("visitor");
    if (tableDefinition && tableDefinition["category"]) {
      await queryInterface.removeColumn("visitor", "category");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("visitor");
    if (tableDefinition && !tableDefinition["category"]) {
      await queryInterface.addColumn("visitor", "category", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },
};
