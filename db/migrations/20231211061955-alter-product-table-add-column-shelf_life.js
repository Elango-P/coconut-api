'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");
    if (tableDefinition && !tableDefinition["shelf_life"]) {
      await queryInterface.addColumn("product", "shelf_life", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");
    if (tableDefinition && tableDefinition["shelf_life"]) {
      await queryInterface.removeColumn("product", "shelf_life");
    }
  },
};