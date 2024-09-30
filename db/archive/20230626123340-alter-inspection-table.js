"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("inspection");

    if (tableDefinition && tableDefinition["type_id"]) {
      return queryInterface.renameColumn(
        "inspection",
        "type_id",
        "tag_id"
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("inspection");

    if (tableDefinition && tableDefinition["tag_id"]) {
      return queryInterface.renameColumn(
        "inspection",
        "tag_id",
        "type_id"
      );
    }
  },
};
