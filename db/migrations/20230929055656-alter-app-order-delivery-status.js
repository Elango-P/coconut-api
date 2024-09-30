'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");
    if (tableDefinition && !tableDefinition["delivery_status"]) {
      await queryInterface.addColumn("order", "delivery_status", {
          type: Sequelize.INTEGER,
          allowNull: true,
    
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");
    if (tableDefinition && tableDefinition["delivery_status"]) {
      await queryInterface.removeColumn("order", "delivery_status");
    }
  },
};