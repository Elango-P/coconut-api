module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Changing integer to date for date in recurring_task table");

      // Define the table
      const tableDefinition = await queryInterface.describeTable("recurring_task");

      // Condition for changing the column type
      if (tableDefinition && tableDefinition["date"]) {
        await queryInterface.changeColumn("recurring_task", "date", {
          type: Sequelize.STRING,
        });
      }
   
    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Define the table
      const tableDefinition = await queryInterface.describeTable("recurring_task");

      if (tableDefinition && tableDefinition["date"]) {
        await queryInterface.changeColumn("recurring_task", "date", {
          type: Sequelize.INTEGER,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
