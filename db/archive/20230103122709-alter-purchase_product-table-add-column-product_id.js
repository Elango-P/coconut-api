
"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const tableDefinition = await queryInterface.describeTable("purchase_product");
      if (tableDefinition && !tableDefinition["product_id"]) {
        await queryInterface.addColumn("purchase_product", "product_id", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition && tableDefinition["product_id"]) {
      await queryInterface.removeColumn("purchase_product", "product_id");
    }
  },
};