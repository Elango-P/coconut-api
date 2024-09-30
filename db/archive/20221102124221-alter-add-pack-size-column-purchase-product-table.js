"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition && !tableDefinition["pack_size"]) {
      await queryInterface.addColumn("purchase_product", "pack_size", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");

    if (tableDefinition && tableDefinition["pack_size"]) {
      await queryInterface.removeColumn("purchase_product", "pack_size");
    }
  }
};

