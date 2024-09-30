module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Changing bigint to string for comments in ticket_test_case table");

      // Define the table
      const tableDefinition = await queryInterface.describeTable("ticket_test_case");

      // Condition for changing the column type
      if (tableDefinition && tableDefinition["comments"]) {
        await queryInterface.changeColumn("ticket_test_case", "comments", {
          type: Sequelize.TEXT,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Define the table
      const tableDefinition = await queryInterface.describeTable("ticket_test_case");

      // Condition for reverting the column type back to bigint
      if (tableDefinition && tableDefinition["comments"]) {
        await queryInterface.changeColumn("ticket_test_case", "comments", {
          type: Sequelize.STRING,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
