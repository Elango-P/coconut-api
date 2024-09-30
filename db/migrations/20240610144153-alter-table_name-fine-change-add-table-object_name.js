"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table:  Add column in fine table");
        
        const tableDefinition = await queryInterface.describeTable("fine");

        if (tableDefinition && !tableDefinition["object_name"]) {
            await queryInterface.addColumn("fine", "object_name", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["object_id"]) {
          await queryInterface.addColumn("fine", "object_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("fine");

        if (tableDefinition && tableDefinition["object_name"]) {
            await queryInterface.removeColumn("fine", "object_name", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        }
        if (tableDefinition && tableDefinition["object_id"]) {
          await queryInterface.removeColumn("fine", "object_id", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
      }
    },
};
