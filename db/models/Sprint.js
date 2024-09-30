module.exports = (sequelize, DataTypes) => {
	const Sprint = sequelize.define("sprint", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		company_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		start_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		end_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE,
		},
		updatedAt: {
			allowNull: true,
			type: DataTypes.DATE,
		},
		deletedAt: {
			allowNull: true,
			type: DataTypes.DATE,
		},
	}, {
		tableName: "sprint",
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt",
		paranoid: true,
	});

	return Sprint;
};
