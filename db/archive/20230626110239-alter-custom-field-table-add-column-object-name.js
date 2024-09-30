"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("custom_field");

    if (tableDefinition && !tableDefinition["object_name"]) {
      await queryInterface.addColumn("custom_field", "object_name", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (tableDefinition && tableDefinition["type_id"]) {
      await queryInterface.renameColumn(
        "custom_field",
        "type_id",
        "tag_id"
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("custom_field");

    if (tableDefinition && tableDefinition["object_name"]) {
      await queryInterface.removeColumn(
        "custom_field",
        "object_name"
      );
    }

    if (tableDefinition && tableDefinition["tag_id"]) {
      await queryInterface.renameColumn(
        "custom_field",
        "tag_id",
        "type_id"
      );
    }

  },
};
