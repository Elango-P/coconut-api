module.exports = (sequelize, DataTypes) =>
	sequelize.define("TicketLink", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		ticket_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		linked_ticket_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		type: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		excluded: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},
	}, {
		tableName: "ticket_link",
		timestamps: true,
		paranoid: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt"
	});
