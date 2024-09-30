module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("bill", {
      type: "foreign key",
      name: "bill_account",
      fields: ["account_id"],
      references: {
        table: "account",
        fields: ["id"],
      },
      onDelete: 'RESTRICT', 
    
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("bill", "account_id");
  },
};