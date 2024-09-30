'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering tag table - Changing the type column allowNull false to true");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("bill");

      // Condition for changing the type column type if it's exist in the table.
      if (tableDefinition && tableDefinition["account_id"]) {
        await queryInterface.changeColumn("bill", "account_id", {
          type : Sequelize.INTEGER,
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
      if (tableDefinition && tableDefinition["account_id"]) {
        await queryInterface.changeColumn("bill", "account_id",{
          type : Sequelize.INTEGER,
          allowNull : true, 
        });
      };
    } catch(err) {
      console.log(err);
    };
  }
};
