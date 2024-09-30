"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("transfer_product");

    if (tableDefinition && !tableDefinition["reason_id"]) {
      await queryInterface.addColumn("transfer_product", "reason_id", {
        type: Sequelize.INTEGER,
        allowNull: true 
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("transfer_product");

    if (tableDefinition && tableDefinition["reason_id"]) {
      await queryInterface.removeColumn("transfer_product", "reason_id");
    }
  },
};
