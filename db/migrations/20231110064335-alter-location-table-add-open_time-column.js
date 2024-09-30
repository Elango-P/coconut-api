'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");

    if (tableDefinition && !tableDefinition["open_time"]) {
      await queryInterface.addColumn("store", "open_time", {
        type: Sequelize.TIME,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["close_time"]) {
      await queryInterface.addColumn("store", "close_time", {
        type: Sequelize.TIME,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");

    if (tableDefinition && tableDefinition["open_time"]) {
      await queryInterface.removeColumn("store", "open_time");
    }
    if (tableDefinition && tableDefinition["close_time"]) {
      await queryInterface.removeColumn("store", "close_time");
    }
  },
};
