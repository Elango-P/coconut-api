module.exports = (sequelize, DataTypes) => {
	const UserDocumentType = sequelize.define("user_document_type", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		document_type: {
			type: DataTypes.STRING,
			allowNull: false
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
		tableName: "user_document_type",
		timestamps: true,
	});

	return UserDocumentType;
};
