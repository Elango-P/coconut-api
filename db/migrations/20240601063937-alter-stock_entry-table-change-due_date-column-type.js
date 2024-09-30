module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      console.log("Changing string to DateOnly for due_date in stock_entry table");

      // Change the column type using the USING clause to cast the existing data
      await queryInterface.sequelize.query(`
        ALTER TABLE "stock_entry"
        ALTER COLUMN "due_date" TYPE DATE USING (due_date::date);
      `);
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      console.log("Reverting DateOnly to string for due_date in stock_entry table");

      // Revert the column type back to STRING
      await queryInterface.changeColumn("stock_entry", "due_date", {
        type: Sequelize.STRING,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
