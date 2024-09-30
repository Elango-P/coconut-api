module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("changing  string to date for   in transfer table");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("transfer");

      // Condition for removing the portal_id column if it's exist in the table
      if (tableDefinition && tableDefinition["due_date"]) {
        await queryInterface.changeColumn('transfer', 'due_date',
        {
          type: 'DATE USING CAST("due_date" as DATE)',
      
        }
      );
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("transfer");
      
      // Condition for adding the portal_id column if it doesn't exist in the table
      if (tableDefinition && tableDefinition["due_date"]) {
        await queryInterface.changeColumn('transfer', 'due_date',
        {
          type: Sequelize.STRING,
      
        }
      );
      }
    } catch (err) {
      console.log(err);
    }
  }
};
