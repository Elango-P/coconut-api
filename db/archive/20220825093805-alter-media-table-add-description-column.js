"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding description to media");
        
        const tableDefinition = await queryInterface.describeTable("media");

        if (tableDefinition && !tableDefinition["description"]) {
            await queryInterface.addColumn("media", "description", {
                type: Sequelize.TEXT,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("media");

        if (tableDefinition && tableDefinition["description"]) {
            await queryInterface.removeColumn("media", "description");
        }
    },
};
