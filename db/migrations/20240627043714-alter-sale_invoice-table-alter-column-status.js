"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("sale_invoice");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.changeColumn("sale_invoice", "status", {
        type:  'INTEGER USING CAST("status" as INTEGER)',
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("sale_invoice");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.changeColumn("sale_invoice", "status", {

        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },
};
