"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding updatedAt to sprint table");
        const tableDefinition = await queryInterface.describeTable("sprint");

        if (tableDefinition && !tableDefinition["updatedAt"]) {
            await queryInterface.addColumn("sprint", "updatedAt", {
                type: Sequelize.DATE,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("sprint");

        if (tableDefinition && tableDefinition["updatedAt"]) {
            await queryInterface.removeColumn("sprint", "updatedAt");
        }
    },
};
