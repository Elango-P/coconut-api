module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Changing bigint to string for order_number in order_product table");

      // Define the table
      const tableDefinition = await queryInterface.describeTable("order_product");

      // Condition for changing the column type
      if (tableDefinition && tableDefinition["order_number"]) {
        await queryInterface.changeColumn("order_product", "order_number", {
          type: Sequelize.STRING,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Define the table
      const tableDefinition = await queryInterface.describeTable("order_product");

      // Condition for reverting the column type back to bigint
      if (tableDefinition && tableDefinition["order_number"]) {
        await queryInterface.changeColumn("order_product", "order_number", {
          type: Sequelize.BIGINT,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
