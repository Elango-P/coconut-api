
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering job table - Changing the type column from string TO integer");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("user_employment");

      // Condition for changing the type column type if it's exist in the table.
      if (tableDefinition && tableDefinition["designation"]) {
        await queryInterface.changeColumn("user_employment", "designation", {
          type : 'INTEGER USING CAST("designation" as INTEGER)',
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
      const tableDefinition = await queryInterface.describeTable("user_employment");

      //Condition for changing the type column if it's not exist in the table.
      if (tableDefinition && tableDefinition["designation"]) {
        await queryInterface.changeColumn("user_employment", "designation",{

          type : Sequelize.STRING,
          allowNull : true,

        });
      };
    } catch(err) {
      console.log(err);
    };
  }
};
