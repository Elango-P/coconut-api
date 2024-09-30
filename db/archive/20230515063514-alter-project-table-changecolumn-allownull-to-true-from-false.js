'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering tag table - Changing the type column from integer to string");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("project");

      // Condition for changing the type column type if it's exist in the table.
      if (tableDefinition && tableDefinition["status_text"]) {
        await queryInterface.changeColumn("project", "status_text", {
          type : Sequelize.STRING,
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
      const tableDefinition = await queryInterface.describeTable("project");

      //Condition for changing the type column if it's not exist in the table.
      if (tableDefinition && tableDefinition["status_text"]) {
        await queryInterface.changeColumn("project", "status_text",{
          type : Sequelize.STRING,
          allowNull : false,
        });
      };
    } catch(err) {
      console.log(err);
    };
  }
};
