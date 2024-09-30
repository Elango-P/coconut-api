module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("changing integer to string for phone number  in vendor table");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("vendor");

      // Condition for removing the portal_id column if it's exist in the table
      if (tableDefinition && tableDefinition["mobile"]) {
        await queryInterface.changeColumn('vendor', 'mobile',
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
      const tableDefinition = await queryInterface.describeTable("vendor");
      
      // Condition for adding the portal_id column if it doesn't exist in the table
      if (tableDefinition && tableDefinition["mobile"]) {
        await queryInterface.changeColumn('vendor', 'mobile',
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
