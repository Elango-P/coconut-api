const { STRING } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding bill_number");
      
      const tableDefinition = await queryInterface.describeTable("bill");

      if (tableDefinition && !tableDefinition["bill_number"]) {
          await queryInterface.addColumn("bill", "bill_number", {
              allowNull: true,
              type: Sequelize.INTEGER,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log("Alter Table: adding bill_number");
      const tableDefinition = await queryInterface.describeTable("bill");

      if (tableDefinition && tableDefinition["bill_number"]) {
          await queryInterface.removeColumn("bill", "bill_number");
      }
  },
};