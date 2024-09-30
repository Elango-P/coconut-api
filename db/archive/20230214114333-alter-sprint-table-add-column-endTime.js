"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding end_time to sprint table");
        const tableDefinition = await queryInterface.describeTable("sprint");

        if (tableDefinition && !tableDefinition["end_time"]) {
            await queryInterface.addColumn("sprint", "end_time", {
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

        if (tableDefinition && tableDefinition["end_time"]) {
            await queryInterface.removeColumn("sprint", "end_time");
        }
    },
};
