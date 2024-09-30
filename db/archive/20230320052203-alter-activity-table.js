"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("activity");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.changeColumn("activity", "status", {
        type: 'INTEGER USING CAST("status" as INTEGER)',
        allowNull: true,
      });
    }
    if (tableDefinition && tableDefinition["user_id"]) {
      await queryInterface.renameColumn(
        "activity",
        "user_id",
        "owner_id"
      );
    }

  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("activity");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.changeColumn("activity", "status", {

        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (tableDefinition && tableDefinition["owner_id"]) {
      await queryInterface.renameColumn(
        "activity",
        "owner_id",
        "user_id"
      );
    }
  },
};
