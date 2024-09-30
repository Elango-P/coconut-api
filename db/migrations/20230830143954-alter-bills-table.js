'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("bill");
    if (tableDefinition && !tableDefinition["returned_items_amount"]) {
      await queryInterface.addColumn("bill", "returned_items_amount", {
          type: Sequelize.NUMERIC,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("bill");
    if (tableDefinition && tableDefinition["returned_items_amount"]) {
      await queryInterface.removeColumn("bill", "returned_items_amount");
    }
  },
};