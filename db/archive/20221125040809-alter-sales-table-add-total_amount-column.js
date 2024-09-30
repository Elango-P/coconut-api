'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering sales table - Adding total_amount column");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("sales");

      // Condition for adding the total_amount column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["total_amount"]) {
        await queryInterface.addColumn("sales", "total_amount", {
          type : Sequelize.DECIMAL,
          allowNull : true,
        });
      }

      // Condition for adding the total_calculated_amount column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["total_calculated_amount"]) {
        await queryInterface.addColumn("sales", "total_calculated_amount", {
          type : Sequelize.DECIMAL,
          allowNull : true,
        });
      }

      // Condition for adding the total_received_amount column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["total_received_amount"]) {
        await queryInterface.addColumn("sales", "total_received_amount", {
          type : Sequelize.DECIMAL,
          allowNull : true,
        });
      }

      // Condition for adding the total_discrepancy_amount column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["total_discrepancy_amount"]) {
        await queryInterface.addColumn("sales", "total_discrepancy_amount", {
          type : Sequelize.DECIMAL,
          allowNull : true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("sales");
      
      // Condition for removing the total_amount column if it's exist in the table
      if (tableDefinition && tableDefinition["total_amount"]) {
        await queryInterface.removeColumn("sales", "total_amount");
      }

       // Condition for removing the total_calculated_amount column if it's exist in the table
       if (tableDefinition && tableDefinition["total_calculated_amount"]) {
        await queryInterface.removeColumn("sales", "total_calculated_amount");
      }

      // Condition for removing the total_received_amount column if it's exist in the table
      if (tableDefinition && tableDefinition["total_received_amount"]) {
        await queryInterface.removeColumn("sales", "total_received_amount");
      }

       // Condition for removing the total_discrepancy_amount column if it's exist in the table
       if (tableDefinition && tableDefinition["total_discrepancy_amount"]) {
        await queryInterface.removeColumn("sales", "total_discrepancy_amount");
      }


    } catch (err) {
      console.log(err);
    }
  }
};