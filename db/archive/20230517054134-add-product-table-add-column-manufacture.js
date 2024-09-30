module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding manufacture in  product");
      
      const tableDefinition = await queryInterface.describeTable("product");

      if (tableDefinition && !tableDefinition["manufacture"]) {
          await queryInterface.addColumn("product", "manufacture", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log("Alter Table: Removing manufacture in  product");
    const tableDefinition = await queryInterface.describeTable("product");

      if (tableDefinition && tableDefinition["manufacture"]) {
          await queryInterface.removeColumn("product", "manufacture");
      }
  },
};