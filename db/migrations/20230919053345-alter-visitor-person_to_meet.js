"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("visitor");
    if (tableDefinition && !tableDefinition["person_to_meet"]) {
      await queryInterface.addColumn("visitor", "person_to_meet", {
        type: Sequelize.INTEGER,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("visitor");
    if (tableDefinition && tableDefinition["visitor"]) {
      await queryInterface.removeColumn("visitor", "person_to_meet");
    }
  },
};