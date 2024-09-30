"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("bill");

    if (tableDefinition && !tableDefinition["cash_discount_percentage"]) {
      await queryInterface.addColumn("bill", "cash_discount_percentage", {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("bill");

    if (tableDefinition && tableDefinition["cash_discount_percentage"]) {
      await queryInterface.removeColumn("bill", "cash_discount_percentage");
    }

  },
};