'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");
    if (tableDefinition && !tableDefinition["shelf_life"]) {
      await queryInterface.addColumn("product_index", "shelf_life", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");
    if (tableDefinition && tableDefinition["shelf_life"]) {
      await queryInterface.removeColumn("product_index", "shelf_life");
    }
  },
};