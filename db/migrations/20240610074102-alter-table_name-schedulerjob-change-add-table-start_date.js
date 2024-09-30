"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table:  Add column in scheduler_job table");
        
        const tableDefinition = await queryInterface.describeTable("scheduler_job");

        if (tableDefinition && !tableDefinition["start_date"]) {
            await queryInterface.addColumn("scheduler_job", "start_date", {
                type: Sequelize.DATEONLY,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["end_date"]) {
          await queryInterface.addColumn("scheduler_job", "end_date", {
              type: Sequelize.DATEONLY,
              allowNull: true,
          });
      }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("scheduler_job");

        if (tableDefinition && tableDefinition["start_date"]) {
            await queryInterface.removeColumn("scheduler_job", "start_date", {
            type: Sequelize.DATEONLY,
            allowNull: true,
        });
        }
        if (tableDefinition && tableDefinition["end_date"]) {
          await queryInterface.removeColumn("scheduler_job", "end_date", {
          type: Sequelize.DATEONLY,
          allowNull: true,
      });
      }
    },
};
