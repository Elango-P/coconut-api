"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_media");

    if (tableDefinition && tableDefinition["description"]) {
      await queryInterface.removeColumn("product_media", "description");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_media");

    if (tableDefinition && !tableDefinition["description"]) {
      await queryInterface.addColumn("product_media", "description", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
