"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Dropping product table");
      await queryInterface.dropTable("product");
    } catch (err) {
      console.log(err);
    }
  },
};
