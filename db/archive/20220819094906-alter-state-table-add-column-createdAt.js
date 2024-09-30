"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding createdAt to state table");
        const tableDefinition = await queryInterface.describeTable("state");

        if (tableDefinition && !tableDefinition["createdAt"]) {
            await queryInterface.addColumn("state", "createdAt", {
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

        if (tableDefinition && tableDefinition["createdAt"]) {
            await queryInterface.removeColumn("state", "createdAt");
        }
    },
};
