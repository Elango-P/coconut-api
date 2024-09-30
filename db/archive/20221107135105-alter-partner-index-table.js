"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const tableDefinition = await queryInterface.describeTable("product_index");

      if (tableDefinition && !tableDefinition["barcode"]) {
        await queryInterface.addColumn("product_index", "barcode", {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");

    if (tableDefinition && tableDefinition["barcode"]) {
      await queryInterface.removeColumn("product_index", "barcode");
    }
  },
};
