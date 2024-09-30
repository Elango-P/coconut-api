"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");
    if (tableDefinition && !tableDefinition["product_media_url"]) {
      await queryInterface.addColumn("product_index", "product_media_url", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");

    if (tableDefinition && tableDefinition["product_media_url"]) {
      await queryInterface.removeColumn("product_index", "product_media_url");
    }
  }
};
