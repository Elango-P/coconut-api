"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
  

      const tableDefinition = await queryInterface.describeTable(
        "pages"
      ); 

      console.log("Alter Table: Adding status to pages table");

      if (tableDefinition && !tableDefinition["status"]) {
        await queryInterface.addColumn("pages", "status", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("pages");

   
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.removeColumn("pages", "status");
    }
  },
};