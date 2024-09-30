"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("inspection");

    if (tableDefinition && tableDefinition["custom_form_id"]) {
      return queryInterface.renameColumn(
        "inspection",
        "custom_form_id",
        "type_id"
      );
    }

    if (tableDefinition && !tableDefinition["store_id"]) {
      await queryInterface.addColumn("inspection", "store_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("inspection");

    if (tableDefinition && tableDefinition["type_id"]) {
      return queryInterface.renameColumn(
        "inspection",
        "type_id",
        "custom_form_id"
      );
    }


    if (tableDefinition && tableDefinition["store_id"]) {
      await queryInterface.removeColumn("inspection", "store_id");
    }
  },
};
