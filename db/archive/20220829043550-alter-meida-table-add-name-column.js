"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding name column");
        
        const tableDefinition = await queryInterface.describeTable("media");

        if (tableDefinition && !tableDefinition["name"]) {
            await queryInterface.addColumn("media", "name", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("media");

        if (tableDefinition && tableDefinition["name"]) {
            await queryInterface.removeColumn("media", "name");
        }
    },
};
