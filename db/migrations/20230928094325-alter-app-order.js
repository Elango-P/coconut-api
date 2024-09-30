'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");
    if (tableDefinition && !tableDefinition["customer_account"]) {
      await queryInterface.addColumn("order", "customer_account", {
          type: Sequelize.INTEGER,
          allowNull: true,
    
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");
    if (tableDefinition && tableDefinition["customer_account"]) {
      await queryInterface.removeColumn("order", "customer_account");
    }
  },
};