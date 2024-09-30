"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering product table - Adding shopify_product_id column");
      await queryInterface.describeTable("product").then((tableDefinition) => {
        if (tableDefinition && !tableDefinition["shopify_product_id"]) {
          return queryInterface.addColumn("product", "shopify_product_id", {
            type: Sequelize.STRING,
            allowNull: true,
          });
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
