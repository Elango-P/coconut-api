module.exports = (sequelize, DataTypes) => {
    const Location = require("./Location")(sequelize, DataTypes);
    const TransferType = require("./TransferType")(sequelize, DataTypes);
    const User = require("./User")(sequelize, DataTypes);
	const status = require("./status")(sequelize, DataTypes);

    const Transfer = sequelize.define("transfer", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        transfer_number: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        from_store_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        to_store_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false
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
        type: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        due_date: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
    }, {
        tableName: "transfer",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        deletedAt: "deletedAt",
        paranoid: true,
    });


    Transfer.belongsTo(Location, {
        as: "from_location",
        foreignKey: ("from_store_id"),
    });
    Transfer.belongsTo(Location, {
        as: "to_location",
        foreignKey: ("to_store_id"),
    });
    Transfer.belongsTo(User, {
        as: "user",
        foreignKey: ("owner_id"),
    });
    Transfer.belongsTo(status, {
        as: "statusDetail",
        foreignKey: "status"
    })

    Transfer.belongsTo(TransferType, { as: "Type", foreignKey: "type" });

    return Transfer;
};
