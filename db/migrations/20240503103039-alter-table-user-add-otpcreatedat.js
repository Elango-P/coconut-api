module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering user table - Adding otp_createdAt column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("user");
      // Condition for adding the otp_createdAt column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["otp_createdAt"]) {
        await queryInterface.addColumn("user", "otp_createdAt", {
          type: Sequelize.DATE,
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
      const tableDefinition = await queryInterface.describeTable("user");
      // Condition for removing the otp_createdAt column if it's exist in the table
      if (tableDefinition && tableDefinition["otp_createdAt"]) {
        await queryInterface.removeColumn("user", "otp_createdAt");
      }
    } catch (err) {
      console.log(err);
    }
  }
};