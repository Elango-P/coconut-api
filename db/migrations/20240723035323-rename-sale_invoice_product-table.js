"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log("Rename sale_invoice_product table to invoice_product");
        await queryInterface.renameTable("sale_invoice_product", "invoice_product");
        console.log("created invoice_product table");
    },



  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("invoice_product", "sale_invoice_product");
  }
};
