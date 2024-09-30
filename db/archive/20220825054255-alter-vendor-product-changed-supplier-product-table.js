"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log("Rename vendor_product table to supplier_product");
        await queryInterface.renameTable("vendor_product", "supplier_product");
    },



  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("supplier_product", "vendor_product");
  }
};
