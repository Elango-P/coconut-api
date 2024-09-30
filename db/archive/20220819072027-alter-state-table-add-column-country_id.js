"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding country_id to state table");
        const tableDefinition = await queryInterface.describeTable("state");

        if (tableDefinition && !tableDefinition["country_id"]) {
            await queryInterface.addColumn("state", "country_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("state");

        if (tableDefinition && tableDefinition["country_id"]) {
            await queryInterface.removeColumn("state", "country_id");
        }
    },
};
