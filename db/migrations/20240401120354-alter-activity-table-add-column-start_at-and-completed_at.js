'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("activity");

      // Condition for adding the completed_at and completed_at.0 column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["started_at"]) {
        await queryInterface.addColumn("activity", "started_at", {
          type: Sequelize.DATE,
          allowNull: true,
        });
      }

      if (tableDefinition && !tableDefinition["completed_at"]) {
        await queryInterface.addColumn("activity", "completed_at", {
          type: Sequelize.DATE,
          allowNull: true,
        });
      }

    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("activity");

      if (tableDefinition && tableDefinition["started_at"]) {
        await queryInterface.removeColumn("activity", "started_at");
      }

      if (tableDefinition && tableDefinition["completed_at"]) {
        await queryInterface.removeColumn("activity", "completed_at");
      }


    
    } catch (err) {
      console.log(err);
    }
  }
};

