"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("visitor");
    if (tableDefinition && !tableDefinition["title"]) {
      await queryInterface.addColumn("visitor", "title", {
        type: Sequelize.STRING,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("visitor");
    if (tableDefinition && tableDefinition["visitor"]) {
      await queryInterface.removeColumn("visitor", "title");
    }
  },
};