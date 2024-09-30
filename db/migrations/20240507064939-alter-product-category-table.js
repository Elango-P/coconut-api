module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product_category");
      // Condition for adding the otp column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["allow_online"]) {
        await queryInterface.addColumn("product_category", "allow_online", {
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
      const tableDefinition = await queryInterface.describeTable("product_category");
      // Condition for removing the otp column if it's exist in the table
      if (tableDefinition && tableDefinition["allow_online"]) {
        await queryInterface.removeColumn("product_category", "allow_online");
      }
    } catch (err) {
      console.log(err);
    }
  }
};