module.exports = (sequelize, DataTypes) => {

    const Address = require("./AddressModel")(sequelize, DataTypes)
    const AccountType = require("./AccountType")(sequelize, DataTypes)
    const vendorSchema = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
        },
        gst_number: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        work_phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address1: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address2: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        pin_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        payment_account: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        cash_discount: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        payment_terms: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        return_terms: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        billing_name: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    };

    const account = sequelize.define("account", vendorSchema, {
        sequelize,
        freezeTableName: true,
        timestamps: true,
        paranoid: true

    });

    account.belongsTo(AccountType, {
        as: 'accountTypeDetail',
        foreignKey: 'type',
    })
    account.hasMany(Address, {
        as: 'Address',
        foreignKey: 'object_id',
    })

    return account;
};
