"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.changeColumn("product_index", "status", {
        type:  'INTEGER USING CAST("status" as INTEGER)',
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.changeColumn("product_index", "status", {

        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
