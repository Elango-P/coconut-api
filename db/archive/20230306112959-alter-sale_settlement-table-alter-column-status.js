"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("sale_settlement");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.changeColumn("sale_settlement", "status", {
        type:  'INTEGER USING CAST("status" as INTEGER)',
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("sale_settlement");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.changeColumn("sale_settlement", "status", {

        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
