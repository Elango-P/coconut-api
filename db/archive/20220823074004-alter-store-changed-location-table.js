"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log("Rename store table to location");
        await queryInterface.renameTable("store", "location");
    },



  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("location", "store");
  }
};
