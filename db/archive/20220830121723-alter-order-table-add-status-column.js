"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding status column");
        
        const tableDefinition = await queryInterface.describeTable("order");

        if (tableDefinition && !tableDefinition["status"]) {
            await queryInterface.addColumn("order", "status", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("order");

        if (tableDefinition && tableDefinition["status"]) {
            await queryInterface.removeColumn("order", "status");
        }
    },
};
