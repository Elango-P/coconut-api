"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding createdAt to sprint table");
        const tableDefinition = await queryInterface.describeTable("sprint");

        if (tableDefinition && !tableDefinition["createdAt"]) {
            await queryInterface.addColumn("sprint", "createdAt", {
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

        if (tableDefinition && tableDefinition["createdAt"]) {
            await queryInterface.removeColumn("sprint", "createdAt");
        }
    },
};
