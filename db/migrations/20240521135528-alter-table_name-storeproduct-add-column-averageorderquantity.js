module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("store_product");
      // Condition for adding the otp column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["average_order_quantity"]) {
        await queryInterface.addColumn("store_product", "average_order_quantity", {
          type: Sequelize.INTEGER,
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
      const tableDefinition = await queryInterface.describeTable("store_product");
      // Condition for removing the otp column if it's exist in the table
      if (tableDefinition && tableDefinition["average_order_quantity"]) {
        await queryInterface.removeColumn("store_product", "average_order_quantity");
      }
    } catch (err) {
      console.log(err);
    }
  }
};