
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering user table - Changing the type column from time TO integer");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("user");

      // Condition for changing the type column type if it's exist in the table.
      if (tableDefinition && tableDefinition["minimum_working_hours"]) {
        await queryInterface.changeColumn("user", "minimum_working_hours", {
          type : 'INTEGER USING EXTRACT(EPOCH FROM minimum_working_hours)/3600::INTEGER',
          allowNull : true,
        });
      };
    } catch (err) {
      console.log(err);
    };
  }, 

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("user");

      //Condition for changing the type column if it's not exist in the table.
      if (tableDefinition && tableDefinition["minimum_working_hours"]) {
        await queryInterface.changeColumn("user", "minimum_working_hours",{

          type : Sequelize.TIME,
          allowNull : true,

        });
      };
    } catch(err) {
      console.log(err);
    };
  }
};
