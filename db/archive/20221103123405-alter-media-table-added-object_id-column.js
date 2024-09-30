"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const tableDefinition = await queryInterface.describeTable("media");

      console.log("Alter Table: Adding status to media table");

      if (tableDefinition && !tableDefinition["object_id"]) {
        await queryInterface.addColumn("media", "object_id", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("media");

    if (tableDefinition && tableDefinition["object_id"]) {
      await queryInterface.removeColumn("media", "object_id");
    }
  },
};
