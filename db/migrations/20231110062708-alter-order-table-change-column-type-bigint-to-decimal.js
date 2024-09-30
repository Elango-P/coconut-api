'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      console.log("Altering order table - Changing the upi_amount column type BIGINT to DECIMAL");
      const userTableExists = await queryInterface.tableExists("order");
      if (userTableExists) {
        const userTableDefinition = await queryInterface.describeTable("order");
        if (userTableDefinition && userTableDefinition["upi_amount"]) {
          await queryInterface.changeColumn("order", "upi_amount", { type: 'DECIMAL USING CAST("upi_amount" as DECIMAL)' });
        };
        if (userTableDefinition && userTableDefinition["cash_amount"]) {
          await queryInterface.changeColumn("order", "cash_amount", { type: 'DECIMAL USING CAST("cash_amount" as DECIMAL)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
  async down (queryInterface, Sequelize) {
    try {
      const userTableExists = await queryInterface.tableExists("order");
      if (userTableExists) {
        const userTableDefinition = await queryInterface.describeTable("order");
        if (userTableDefinition && userTableDefinition["upi_amount"]) {
          await queryInterface.changeColumn("order", "upi_amount", { type: 'BIGINT USING CAST("upi_amount" as BIGINT)' });
        };
        if (userTableDefinition && userTableDefinition["cash_amount"]) {
          await queryInterface.changeColumn("order", "cash_amount", { type: 'BIGINT USING CAST("cash_amount" as BIGINT)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};