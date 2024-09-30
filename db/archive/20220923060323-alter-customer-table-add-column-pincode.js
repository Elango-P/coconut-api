"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("customer");

    if (tableDefinition && !tableDefinition["pincode"]) {
      await queryInterface.addColumn("customer", "pincode", {
        type: Sequelize.STRING,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("sales");

    if (tableDefinition && tableDefinition["pincode"]) {
      await queryInterface.removeColumn("customer", "pincode");
    }
  },
};
