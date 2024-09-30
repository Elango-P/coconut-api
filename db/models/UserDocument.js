module.exports = (sequelize, DataTypes) => {
	const UserDocument = sequelize.define("user_document", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		document_type: {
			type: DataTypes.STRING,
			allowNull: true
		},
		document_url: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},

	}, {
		tableName: "user_document",
		timestamps: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt"
	});

	return UserDocument;
};
