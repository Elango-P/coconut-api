module.exports = (sequelize, DataTypes) =>
	sequelize.define("CandidateMessage", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		from_email: {
			type: DataTypes.STRING,
			allowNull: true
		},
		to_email: {
			type: DataTypes.STRING,
			allowNull: true
		},
		candidate_id: {
			type: DataTypes.STRING,
			allowNull: true
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull:false
		},
	}, {
		tableName: "candidate_message",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: false,
		deletedAt: false
	});
