module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding igst_percentage to product table");
      
      const tableDefinition = await queryInterface.describeTable("product");

      if (tableDefinition && !tableDefinition["igst_percentage"]) {
          await queryInterface.addColumn("product", "igst_percentage", {
              allowNull: true,
              type: Sequelize.DECIMAL,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log("Alter Table: Removing cgst to product table");
      const tableDefinition = await queryInterface.describeTable("product");

      if (tableDefinition && tableDefinition["igst_percentage"]) {
          await queryInterface.removeColumn("product", "igst_percentage");
      }
  },
};
