'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering transfer_product table - Adding unit_price column");

      // Defining whether the transfer_product table already exist or not.
      const transferProductTableExists = await queryInterface.tableExists("transfer_product");

      // Condition for altering the table only if the table is exist.
      if (transferProductTableExists) {
        // Defining the table
        const transferProductTableDefinition = await queryInterface.describeTable("transfer_product");

        // Condition for adding the unit_price column if it doesn't exist in the table.
        if (transferProductTableDefinition && !transferProductTableDefinition["unit_price"]) {
          await queryInterface.addColumn("transfer_product", "unit_price", {
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
        
        // Condition for removing the unit_price column if it's exist in the table.
        if (transferProductTableDefinition && transferProductTableDefinition["unit_price"]) {
          await queryInterface.removeColumn("transfer_product", "unit_price");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};
