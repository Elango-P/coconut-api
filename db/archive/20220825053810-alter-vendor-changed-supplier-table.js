"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log("Rename vendor table to supplier");
        await queryInterface.renameTable("vendor", "supplier");
    },



  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("supplier", "vendor");
  }
};
