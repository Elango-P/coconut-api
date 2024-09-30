"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("fine");
    if (tableDefinition && tableDefinition["total_amount"]) {
      await queryInterface.removeColumn("fine", "total_amount");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("fine");

  
    if (tableDefinition && !tableDefinition["total_amount"]) {
      await queryInterface.addColumn("fine", "total_amount",{
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
  }
};
