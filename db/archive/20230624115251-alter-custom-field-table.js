"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("custom_field");

    if (tableDefinition && tableDefinition["custom_form_id"]) {
      return queryInterface.renameColumn(
        "custom_field",
        "custom_form_id",
        "type_id"
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("custom_field");

    if (tableDefinition && tableDefinition["type_id"]) {
      return queryInterface.renameColumn(
        "custom_field",
        "type_id",
        "custom_form_id"
      );
    }
  },
};
