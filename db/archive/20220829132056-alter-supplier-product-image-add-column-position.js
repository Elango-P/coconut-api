"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding position to supplier_product_image");

      const tableDefinition = await queryInterface.describeTable("supplier_product_image");

      if (tableDefinition && !tableDefinition["position"]) {
        await queryInterface.addColumn("supplier_product_image", "position", {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {

    try {
      const tableDefinition = await queryInterface.describeTable("supplier_product_image");

      if (tableDefinition && tableDefinition["position"]) {
        await queryInterface.removeColumn("supplier_product_image", "position");
      }
    } catch (err) {
      console.log(err);
    };

  }
};
