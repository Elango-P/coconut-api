'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering pages table - Adding content column");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("pages");

      // Condition for adding the content column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["content"]) {
        await queryInterface.addColumn("pages", "content", {
          type : Sequelize.TEXT,
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
      const tableDefinition = await queryInterface.describeTable("pages");

      // Condition for removing the content column if it's exist in the table.
      if (tableDefinition && tableDefinition["content"]) {
        await queryInterface.removeColumn("pages", "content");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
