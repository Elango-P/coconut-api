module.exports = (sequelize, DataTypes) => {
	const AccountVendor = sequelize.define("account_vendor", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true
		},
		address1: {
			type: DataTypes.STRING,
			allowNull: true
		},
		address2: {
			type: DataTypes.STRING,
			allowNull: true
		},
        city: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pin_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bank_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bank_account_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
		bank_routing_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},

	}, {
		tableName: "account_vendor",
		timestamps: true,
        paranoid: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});

	return AccountVendor;
};
