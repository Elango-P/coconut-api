"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");
    if (tableDefinition && !tableDefinition["longitude"]) {
      await queryInterface.addColumn("store", "longitude", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");
    if (tableDefinition && tableDefinition["store"]) {
      await queryInterface.removeColumn("store", "longitude");
    }
  },
};
