"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log("Rename store_product table to location_product");
        await queryInterface.renameTable("store_product", "location_product");
        console.log("created location_product table");
    },



  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("location_product", "store_product");
  }
};
