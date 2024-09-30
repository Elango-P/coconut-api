"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("salary");

    if (tableDefinition && !tableDefinition["monthly_salary"]) {
      await queryInterface.addColumn("salary", "monthly_salary", {
        type: Sequelize.DECIMAL,
        allowNull: true
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("salary");

    if (tableDefinition && tableDefinition["monthly_salary"]) {
      await queryInterface.removeColumn("salary", "monthly_salary");
    }

  },
};
