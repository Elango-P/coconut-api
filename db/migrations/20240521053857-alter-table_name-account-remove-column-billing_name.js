module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("account");
      // Condition for adding the otp column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["billing_name"]) {
        await queryInterface.addColumn("account", "billing_name", {
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
      const tableDefinition = await queryInterface.describeTable("account");
      // Condition for removing the otp column if it's exist in the table
      if (tableDefinition && tableDefinition["billing_name"]) {
        await queryInterface.removeColumn("account", "billing_name");
      }
    } catch (err) {
      console.log(err);
    }
  }
};