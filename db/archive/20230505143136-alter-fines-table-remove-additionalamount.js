"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("fine");
    if (tableDefinition && tableDefinition["additional_amount"]) {
      await queryInterface.removeColumn("fine", "additional_amount");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("fine");

  
    if (tableDefinition && !tableDefinition["additional_amount"]) {
      await queryInterface.addColumn("fine", "additional_amount",{
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
  }
};
