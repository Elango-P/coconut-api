
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
  

      const tableDefinition = await queryInterface.describeTable(
        "scheduler_job"
      ); 

      console.log("Alter Table: Adding status to scheduler_job table");

      if (tableDefinition && !tableDefinition["execution_started_at"]) {
        await queryInterface.addColumn("scheduler_job", "execution_started_at", {
          type: Sequelize.DATE,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("scheduler_job");

   
    if (tableDefinition && tableDefinition["execution_started_at"]) {
      await queryInterface.removeColumn("scheduler_job", "execution_started_at");
    }
  },
};
