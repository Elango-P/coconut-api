"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding updatedAt to state table");
        const tableDefinition = await queryInterface.describeTable("state");

        if (tableDefinition && !tableDefinition["updatedAt"]) {
            await queryInterface.addColumn("state", "updatedAt", {
                type: Sequelize.DATE,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("state");

        if (tableDefinition && tableDefinition["updatedAt"]) {
            await queryInterface.removeColumn("state", "updatedAt");
        }
    },
};
