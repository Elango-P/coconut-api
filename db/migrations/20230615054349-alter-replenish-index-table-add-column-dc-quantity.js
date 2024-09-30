'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("replenish_index");
    if (tableDefinition && !tableDefinition["distribution_center_quantity"]) {
      await queryInterface.addColumn("replenish_index", "distribution_center_quantity", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("replenish_index");
    if (tableDefinition && tableDefinition["distribution_center_quantity"]) {
      await queryInterface.removeColumn("replenish_index", "distribution_center_quantity");
    }
  },
};
