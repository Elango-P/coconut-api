'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");
    if (tableDefinition && !tableDefinition["total_cgst_amount"]) {
      await queryInterface.addColumn("order", "total_cgst_amount", {
          type: Sequelize.DECIMAL,
          allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["total_sgst_amount"]) {
      await queryInterface.addColumn("order", "total_sgst_amount", {
          type: Sequelize.DECIMAL,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");
    if (tableDefinition && tableDefinition["total_cgst_amount"]) {
      await queryInterface.removeColumn("order", "total_cgst_amount");
    }
    if (tableDefinition && tableDefinition["total_sgst_amount"]) {
      await queryInterface.removeColumn("order", "total_sgst_amount");
    }
  },
};