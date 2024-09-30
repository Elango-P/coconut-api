'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");

    if (tableDefinition && !tableDefinition["is_active_price"]) {
      await queryInterface.addColumn("status", "is_active_price", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");

    if (tableDefinition && tableDefinition["is_active_price"]) {
      await queryInterface.removeColumn("status", "is_active_price");
    }
  },
};
