module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("purchase_order", {
      type: "foreign key",
      name: "purchase_order_account",
      fields: ["vendor_id"],
      references: {
        table: "account",
        fields: ["id"],
      },
      onDelete: 'RESTRICT', 
    
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("purchase_order", "vendor_id");
  },
};