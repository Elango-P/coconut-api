"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const tableDefinition = await queryInterface.describeTable("scheduler_job");

      if (tableDefinition && !tableDefinition["start_time"]) {
        await queryInterface.addColumn("scheduler_job", "start_time", {
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

    if (tableDefinition && tableDefinition["start_time"]) {
      await queryInterface.removeColumn("scheduler_job", "start_time")
    }

  },
};
