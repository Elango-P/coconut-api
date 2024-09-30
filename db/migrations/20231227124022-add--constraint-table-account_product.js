module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("account_product", {
      type: "foreign key",
      name: "product_account",
      fields: ["account_id"],
      references: {
        table: "account",
        fields: ["id"],
      },
      onDelete: 'RESTRICT', 
    
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("account_product", "account_id");
  },
};