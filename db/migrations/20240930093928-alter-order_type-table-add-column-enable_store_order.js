module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_type");

    if (tableDefinition && !tableDefinition["allow_store_order"]) {
      await queryInterface.addColumn("order_type", "allow_store_order", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["allow_delivery"]) {
      await queryInterface.addColumn("order_type", "allow_delivery", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_type");

    if (tableDefinition && tableDefinition["allow_store_order"]) {
      await queryInterface.removeColumn("order_type", "allow_store_order");
    }
    if (tableDefinition && tableDefinition["allow_delivery"]) {
      await queryInterface.removeColumn("order_type", "allow_delivery");
    }
  },
};
