module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding last_purchased_date in  product_index");
      
      const tableDefinition = await queryInterface.describeTable("product_index");

      if (tableDefinition && !tableDefinition["last_purchased_date"]) {
          await queryInterface.addColumn("product_index", "last_purchased_date", {
              type: Sequelize.DATE,
              allowNull: true,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log("Alter Table: Removing last_purchased_date in  product_index");
    const tableDefinition = await queryInterface.describeTable("product_index");

      if (tableDefinition && tableDefinition["last_purchased_date"]) {
          await queryInterface.removeColumn("product_index", "last_purchased_date");
      }
  },
};