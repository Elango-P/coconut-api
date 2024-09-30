module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Changing bigint to string for date in activity table");

      // Define the table
      const tableDefinition = await queryInterface.describeTable("activity");

      // Condition for changing the column type
      if (tableDefinition && tableDefinition["date"]) {
        await queryInterface.changeColumn("activity", "date", {
          type: Sequelize.DATE,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Define the table
      const tableDefinition = await queryInterface.describeTable("activity");

      // Condition for reverting the column type back to bigint
      if (tableDefinition && tableDefinition["date"]) {
        await queryInterface.changeColumn("activity", "date", {
          type: Sequelize.DATE,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
