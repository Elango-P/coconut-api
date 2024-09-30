"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");
    if (tableDefinition && !tableDefinition["latitude"]) {
      await queryInterface.addColumn("store", "latitude", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");
    if (tableDefinition && tableDefinition["store"]) {
      await queryInterface.removeColumn("store", "latitude");
    }
  },
};
