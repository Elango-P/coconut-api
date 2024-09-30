"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        
        const tableDefinition = await queryInterface.describeTable("user_index");

        if (tableDefinition && !tableDefinition["current_location_id"]) {
            await queryInterface.addColumn("user_index", "current_location_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["current_shift_id"]) {
          await queryInterface.addColumn("user_index", "current_shift_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("user_index");

        if (tableDefinition && tableDefinition["current_location_id"]) {
            await queryInterface.removeColumn("user_index", "current_location_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        }

        if (tableDefinition && tableDefinition["current_shift_id"]) {
          await queryInterface.removeColumn("user_index", "current_shift_id", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
      }
    },
};
