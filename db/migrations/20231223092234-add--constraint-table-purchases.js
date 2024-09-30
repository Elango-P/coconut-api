module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("purchase", {
      type: "foreign key",
      name: "account_vendor",
      fields: ["vendor_id"],
      references: {
        table: "account",
        fields: ["id"],
      },
      onDelete: 'RESTRICT', 

    
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("purchase", "vendor_id");
  },
};