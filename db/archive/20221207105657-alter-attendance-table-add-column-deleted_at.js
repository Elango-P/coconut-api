"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding deleted_at to attendance table");
        const tableDefinition = await queryInterface.describeTable("attendance");

        if (tableDefinition && !tableDefinition["deleted_at"]) {
            await queryInterface.addColumn("attendance", "deleted_at", {
                type: Sequelize.DATE,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("attendance");

        if (tableDefinition && tableDefinition["deleted_at"]) {
            await queryInterface.removeColumn("attendance", "deleted_at");
        }
    },
};
