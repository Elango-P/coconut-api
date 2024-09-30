module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding replenish quantity in store product");
      
      const tableDefinition = await queryInterface.describeTable("store_product");

      if (tableDefinition && !tableDefinition["replenish_quantity"]) {
          await queryInterface.addColumn("store_product", "replenish_quantity", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log("Alter Table: Removing replenish quantity in store product");
    const tableDefinition = await queryInterface.describeTable("store_product");

      if (tableDefinition && tableDefinition["replenish_quantity"]) {
          await queryInterface.removeColumn("store_product", "replenish_quantity");
      }
  },
};
