"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding uuid column to order table");
        
        const tableDefinition = await queryInterface.describeTable("order");

        if (tableDefinition && !tableDefinition["uuid"]) {
            await queryInterface.addColumn("order", "uuid", {
                type: Sequelize.UUID,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("order");

        if (tableDefinition && tableDefinition["uuid"]) {
            await queryInterface.removeColumn("order", "uuid");
        }
    },
};
