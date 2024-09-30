'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      return queryInterface.describeTable("transfer_product").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["store_product_id"]) {
          return queryInterface.removeColumn("transfer_product", "store_product_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
