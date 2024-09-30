'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering purchase_product table - Removing mrp column");
      return queryInterface.describeTable("purchase_product").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["mrp"]) {
          return queryInterface.removeColumn("purchase_product", "mrp");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};

