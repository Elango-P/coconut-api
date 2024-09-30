'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");
    if (tableDefinition && !tableDefinition["allow_sale"]) {
      await queryInterface.addColumn("store", "allow_sale", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");
    if (tableDefinition && tableDefinition["allow_sale"]) {
      await queryInterface.removeColumn("store", "allow_sale");
    }
  },
};
