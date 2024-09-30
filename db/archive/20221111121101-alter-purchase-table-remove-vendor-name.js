"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase");
    if (tableDefinition && tableDefinition["vendor_name"]) {
      await queryInterface.removeColumn("purchase", "vendor_name");
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase");

    if (tableDefinition && !tableDefinition["vendor_name"]) {
      await queryInterface.addColumn("purchase", "vendor_name",{
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  }
};