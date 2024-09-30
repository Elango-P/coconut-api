module.exports = (sequelize, DataTypes) => {
    const company = require("./Company")(sequelize, DataTypes);
    const portal = sequelize.define(
        "portal",
        {
            portal_name: {
                type: DataTypes.STRING,
            },
            company_id: {
                type: DataTypes.INTEGER,
            },
            portal_url: {
                type: DataTypes.STRING,
            },
            template: {
                type: DataTypes.STRING,
            },
        },
        {
            freezeTableName: true,
            paranoid: true,
        }
    );

    portal.belongsTo(company,{
        as: "companyData",
        foreignKey: "company_id"
    })

    return portal;
};
