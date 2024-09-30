'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("transfer_product");
    if (tableDefinition && !tableDefinition["date"]) {
      await queryInterface.addColumn("transfer_product", "date", {
          type: Sequelize.DATEONLY,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("transfer_product");
    if (tableDefinition && tableDefinition["date"]) {
      await queryInterface.removeColumn("transfer_product", "date");
    }
  },
};