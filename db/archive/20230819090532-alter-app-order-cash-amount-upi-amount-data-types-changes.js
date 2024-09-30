module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("changing BIGINT to NUMERIC for cash_amount and upi_amount in order table");
      const tableDefinition = await queryInterface.describeTable("order");

      if (tableDefinition && !tableDefinition["cash_amount"]){   
         await queryInterface.changeColumn('order', 'cash_amount', {
        type: Sequelize.NUMERIC,
      });
    }
      
    if (tableDefinition && !tableDefinition["upi_amount"]){   
      await queryInterface.changeColumn('order', 'upi_amount', {
        type: Sequelize.NUMERIC,
      });
    }
    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      const tableDefinition = await queryInterface.describeTable("order");

      if (tableDefinition && !tableDefinition["cash_amount"]){   
        await queryInterface.changeColumn('order', 'cash_amount', {
        type: Sequelize.BIGINT,
      });
    }
      
    if (tableDefinition && !tableDefinition["upi_amount"]){   
      await queryInterface.changeColumn('order', 'upi_amount', {
        type: Sequelize.BIGINT,
      });
    }
    } catch (err) {
      console.log(err);
    }
  }
};
