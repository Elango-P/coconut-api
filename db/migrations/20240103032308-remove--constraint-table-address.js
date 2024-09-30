
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("address", "account_address");

    
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("address", {
      type: "foreign key",
      name: "account_address",
      fields: ["object_id"],
      references: {
        table: "account",
        fields: ["id"],
      },
      onDelete: 'RESTRICT', 
    
    });
  },
};