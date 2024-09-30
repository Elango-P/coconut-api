'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering transfer_product table - Adding amount column");

      // Defining whether the transfer_product table already exist or not.
      const transferProductTableExists = await queryInterface.tableExists("transfer_product");

      // Condition for altering the table only if the table is exist.
      if (transferProductTableExists) {
        // Defining the table
        const transferProductTableDefinition = await queryInterface.describeTable("transfer_product");

        // Condition for adding the amount column if it doesn't exist in the table.
        if (transferProductTableDefinition && !transferProductTableDefinition["amount"]) {
          await queryInterface.addColumn("transfer_product", "amount", {
            type: Sequelize.DECIMAL,
            allowNull: true,
          });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining whether the transfer_product table already exist or not.
      const transferProductTableExists = await queryInterface.tableExists("transfer_product");

      // Condition for altering the table only if the table is exist.
      if (transferProductTableExists) {
        // Defining the table
        const transferProductTableDefinition = await queryInterface.describeTable("transfer_product");
        
        // Condition for removing the amount column if it's exist in the table.
        if (transferProductTableDefinition && transferProductTableDefinition["amount"]) {
          await queryInterface.removeColumn("transfer_product", "amount");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};
