module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Define the table
      const tableDefinition = await queryInterface.describeTable("scheduler_job");

      // Condition for changing the column type
      if (tableDefinition && tableDefinition["start_time"]) {
        await queryInterface.changeColumn("scheduler_job", "start_time", {
          type: Sequelize.TIME,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Define the table
      const tableDefinition = await queryInterface.describeTable("scheduler_job");

      // Condition for reverting the column type back to bigint
      if (tableDefinition && tableDefinition["start_time"]) {
        await queryInterface.changeColumn("scheduler_job", "start_time", {
          type: Sequelize.DATE,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
