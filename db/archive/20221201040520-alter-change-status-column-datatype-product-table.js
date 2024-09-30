"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.changeColumn("product", "status", {
        type:  'INTEGER USING CAST("status" as INTEGER)',
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.changeColumn("product", "status", {

        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
