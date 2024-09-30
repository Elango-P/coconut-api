'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering tag table - Changing the type column allowNull false to true");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("holiday");

      // Condition for changing the type column type if it's exist in the table.
      if (tableDefinition && tableDefinition["date"]) {
        await queryInterface.changeColumn("holiday", "date", {
          type : Sequelize.DATEONLY,
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
      const tableDefinition = await queryInterface.describeTable("holiday");

      //Condition for changing the type column if it's not exist in the table.
      if (tableDefinition && tableDefinition["date"]) {
        await queryInterface.changeColumn("holiday", "date",{
          type : Sequelize.DATEONLY,
          allowNull : true, 
        });
      };
    } catch(err) {
      console.log(err);
    };
  }
};
