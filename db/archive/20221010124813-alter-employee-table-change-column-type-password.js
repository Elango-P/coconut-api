module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("changing integer to string for mobile_number1  in vendor table");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("employee");

      // Condition for removing the portal_id column if it's exist in the table
      if (tableDefinition && tableDefinition["password"]) {
        await queryInterface.changeColumn('employee', 'password',
        {
          type: Sequelize.STRING,
          allowNull:true,
      
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
      const tableDefinition = await queryInterface.describeTable("customer");
      
      // Condition for adding the portal_id column if it doesn't exist in the table
      if (tableDefinition && tableDefinition["password"]) {
        await queryInterface.changeColumn('employee', 'password',
        {
          type: Sequelize.STRING,
          allowNull:false,
      
        }
                );
      }
    } catch (err) {
      console.log(err);
    }
  }
};