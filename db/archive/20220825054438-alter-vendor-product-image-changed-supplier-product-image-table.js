"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log("Rename vendor_product_image table to supplier_product_image");
        await queryInterface.renameTable("vendor_product_image", "supplier_product_image");
    },



  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("supplier_product_image", "vendor_product_image");
  }
};
