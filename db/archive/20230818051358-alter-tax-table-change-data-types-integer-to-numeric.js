module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("changing integer to numeric for tax_amount and tax_percentage and amount in tax table");

      // Change tax_amount column to numeric
      await queryInterface.changeColumn('tax', 'tax_amount', {
        type: Sequelize.NUMERIC,
      });
      await queryInterface.changeColumn('tax', 'amount', {
        type: Sequelize.NUMERIC,
      });

      // Change tax_percentage column to numeric
      await queryInterface.changeColumn('tax', 'tax_percentage', {
        type: Sequelize.NUMERIC,
      });
    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Change tax_amount column back to integer
      await queryInterface.changeColumn('tax', 'tax_amount', {
        type: Sequelize.INTEGER,
      });
      await queryInterface.changeColumn('tax', 'amount', {
        type: Sequelize.INTEGER,
      });

      // Change tax_percentage column back to integer
      await queryInterface.changeColumn('tax', 'tax_percentage', {
        type: Sequelize.INTEGER,
      });
    } catch (err) {
      console.log(err);
    }
  }
};
