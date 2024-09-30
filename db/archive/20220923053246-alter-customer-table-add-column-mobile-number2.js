"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("customer");

    if (tableDefinition && !tableDefinition["mobile_number2"]) {
      await queryInterface.addColumn("customer", "mobile_number2", {
        type: Sequelize.STRING,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("sales");

    if (tableDefinition && tableDefinition["mobile_number2"]) {
      await queryInterface.removeColumn("customer", "mobile_number2");
    }
  },
};
