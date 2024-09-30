const { STRING } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding bill_id");
      
      const tableDefinition = await queryInterface.describeTable("account_entry");

      if (tableDefinition && !tableDefinition["bill_id"]) {
          await queryInterface.addColumn("account_entry", "bill_id", {
              allowNull: true,
              type: Sequelize.INTEGER,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log("Alter Table: adding bill_id");
      const tableDefinition = await queryInterface.describeTable("account_entry");

      if (tableDefinition && tableDefinition["bill_id"]) {
          await queryInterface.removeColumn("account_entry", "bill_id");
      }
  },
};