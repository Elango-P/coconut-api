module.exports = (sequelize, DataTypes) => {
	const Location = require("./Location")(sequelize, DataTypes);
	const Account = sequelize.define("payment", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		payment_account_type: {
			type: DataTypes.STRING,
			allowNull: false
		},
		payment_account_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		payment_account_number: {
			type: DataTypes.STRING,
			allowNull: false
		},
		bank_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
        description: {
			type: DataTypes.STRING,
			allowNull: true
		},
		ifsc: {
			type: DataTypes.STRING,
			allowNull: false
		},
        primary: {
            type: DataTypes.INTEGER,
			allowNull: false
        },
		company_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		created_by: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
	}, {
		tableName: "payment_account",
		timestamps: true,
		paranoid: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt"
	});

	return Account;
};
