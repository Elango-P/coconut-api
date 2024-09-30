"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("inspection");


    if (tableDefinition && !tableDefinition["store_id"]) {
      await queryInterface.addColumn("inspection", "store_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("inspection");


    if (tableDefinition && tableDefinition["store_id"]) {
      await queryInterface.removeColumn("inspection", "store_id");
    }
  },
};
