"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding deletedAt to state table");
        const tableDefinition = await queryInterface.describeTable("state");

        if (tableDefinition && !tableDefinition["deletedAt"]) {
            await queryInterface.addColumn("state", "deletedAt", {
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

        if (tableDefinition && tableDefinition["deletedAt"]) {
            await queryInterface.removeColumn("state", "deletedAt");
        }
    },
};
