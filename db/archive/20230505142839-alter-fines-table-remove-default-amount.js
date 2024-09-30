"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("fine");
    if (tableDefinition && tableDefinition["default_amount"]) {
      await queryInterface.removeColumn("fine", "default_amount");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");

  
    if (tableDefinition && !tableDefinition["default_amount"]) {
      await queryInterface.addColumn("fine", "default_amount",{
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
  }
};