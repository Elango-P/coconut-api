"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding sprint to ticket table");
      const tableDefinition = await queryInterface.describeTable("ticket");

      if (tableDefinition && !tableDefinition["sprint"]) {
        await queryInterface.addColumn("ticket", "sprint", {
          type: Sequelize.TEXT,
          allowNull: true
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("ticket");

    if (tableDefinition && tableDefinition["sprint"]) {
      await queryInterface.removeColumn("ticket", "sprint");
    }
  },
};
