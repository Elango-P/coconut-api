// Change week_days DataType
exports.up = function up(queryInterface, Sequelize) {
	return queryInterface.changeColumn("user", "week_days",{
			type: Sequelize.TEXT,
			allowNull: true
	})
};

exports.down = function down(queryInterface) {
	return queryInterface.dropTable("user");
};
