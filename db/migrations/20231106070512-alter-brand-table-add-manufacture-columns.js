'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_brand");

    if (tableDefinition && !tableDefinition["manufacture_id"]) {
      await queryInterface.addColumn("product_brand", "manufacture_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_brand");

    if (tableDefinition && tableDefinition["manufacture_id"]) {
      await queryInterface.removeColumn("product_brand", "manufacture_id");
    }
  },
};
