"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding deletedAt to sprint table");
        const tableDefinition = await queryInterface.describeTable("sprint");

        if (tableDefinition && !tableDefinition["deletedAt"]) {
            await queryInterface.addColumn("sprint", "deletedAt", {
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

        if (tableDefinition && tableDefinition["deletedAt"]) {
            await queryInterface.removeColumn("sprint", "deletedAt");
        }
    },
};
