'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering job table - Changing the type column from string TO integer");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("bill");

      // Condition for changing the type column type if it's exist in the table.
      if (tableDefinition && tableDefinition["status"]) {
        await queryInterface.changeColumn("bill", "status", {
          type : 'INTEGER USING CAST("status" as INTEGER)',
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
      const tableDefinition = await queryInterface.describeTable("bill");

      //Condition for changing the type column if it's not exist in the table.
      if (tableDefinition && tableDefinition["status"]) {
        await queryInterface.changeColumn("bill", "status",{

          type : Sequelize.STRING,
          allowNull : true,

        });
      };
    } catch(err) {
      console.log(err);
    };
  }
};

