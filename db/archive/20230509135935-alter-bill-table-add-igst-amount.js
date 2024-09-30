module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding igst to bill table");
      
      const tableDefinition = await queryInterface.describeTable("bill");

      if (tableDefinition && !tableDefinition["igst_amount"]) {
          await queryInterface.addColumn("bill", "igst_amount", {
              allowNull: true,
              type: Sequelize.DECIMAL,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log("Alter Table: Removing cgst to bill table");
      const tableDefinition = await queryInterface.describeTable("bill");

      if (tableDefinition && tableDefinition["igst_amount"]) {
          await queryInterface.removeColumn("bill", "igst_amount");
      }
  },
};
