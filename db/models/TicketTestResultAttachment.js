module.exports = (sequelize, DataTypes) =>
	sequelize.define("TicketTestResultAttachment", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		test_result_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		ticket_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		page_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		summary: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		media_name: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		sort: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: "0"
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "ticket_test_result_attachment",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: false,
		paranoid: true,
	});
