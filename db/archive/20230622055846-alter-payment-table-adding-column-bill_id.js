const { STRING } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding bill_id");
      
      const tableDefinition = await queryInterface.describeTable("payment");

      if (tableDefinition && !tableDefinition["bill_id"]) {
          await queryInterface.addColumn("payment", "bill_id", {
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
      const tableDefinition = await queryInterface.describeTable("payment");

      if (tableDefinition && tableDefinition["bill_id"]) {
          await queryInterface.removeColumn("payment", "bill_id");
      }
  },
};
