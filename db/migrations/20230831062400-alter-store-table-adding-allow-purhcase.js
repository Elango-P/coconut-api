'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");
    if (tableDefinition && !tableDefinition["allow_purchase"]) {
      await queryInterface.addColumn("store", "allow_purchase", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");
    if (tableDefinition && tableDefinition["allow_purchase"]) {
      await queryInterface.removeColumn("store", "allow_purchase");
    }
  },
};

