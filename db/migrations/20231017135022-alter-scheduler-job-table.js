module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("scheduler_job");
    if (tableDefinition && !tableDefinition["end_time"]) {
      await queryInterface.addColumn("scheduler_job", "end_time", {
        type: Sequelize.TIME,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("scheduler_job");
    if (tableDefinition && tableDefinition["end_time"]) {
      await queryInterface.removeColumn("scheduler_job", "end_time");
    }
  },
};
