"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log("Rename sale table to payment");
        await queryInterface.renameTable("sale", "payment");
    },



  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("payment", "sale");
  }
};
