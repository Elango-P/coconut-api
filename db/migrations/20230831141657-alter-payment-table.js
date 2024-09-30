'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("payment");
    if (tableDefinition && !tableDefinition["invoice_number"]) {
      await queryInterface.addColumn("payment", "invoice_number", {
          type: Sequelize.STRING,
          allowNull: true,
    
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("payment");
    if (tableDefinition && tableDefinition["invoice_number"]) {
      await queryInterface.removeColumn("payment", "invoice_number");
    }
  },
}