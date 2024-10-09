"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log("Rename sale_invoice table to invoice");
        await queryInterface.renameTable("sale_invoice", "invoice");
        console.log("created invoice table");
    },



  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("invoice", "sale_invoice");
  }
};
