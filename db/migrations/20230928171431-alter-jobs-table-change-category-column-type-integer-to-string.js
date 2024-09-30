module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("changing integer to string for phone number  in jobs table");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("jobs");

      // Condition for removing the portal_id column if it's exist in the table
      if (tableDefinition && tableDefinition["category"]) {
        await queryInterface.changeColumn('jobs', 'category',
        {
          type: Sequelize.STRING,
      
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
      const tableDefinition = await queryInterface.describeTable("jobs");
      
      // Condition for adding the portal_id column if it doesn't exist in the table
      if (tableDefinition && tableDefinition["category"]) {
        await queryInterface.changeColumn('jobs', 'category',
        {
          type: Sequelize.INTEGER,
      
        }
      );
      }
    } catch (err) {
      console.log(err);
    }
  }
};
