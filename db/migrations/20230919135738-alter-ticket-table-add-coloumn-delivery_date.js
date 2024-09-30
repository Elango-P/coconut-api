"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("ticket");
    if (tableDefinition && !tableDefinition["delivery_date"]) {
      await queryInterface.addColumn("ticket", "delivery_date", {
        type: Sequelize.DATEONLY,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("ticket");
    if (tableDefinition && tableDefinition["ticket"]) {
      await queryInterface.removeColumn("ticket", "delivery_date");
    }
  },
};