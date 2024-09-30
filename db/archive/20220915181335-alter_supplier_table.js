"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("vendor");

        if (tableDefinition && tableDefinition["supplier_id"]) {
            return queryInterface.renameColumn(
                "vendor",
                "supplier_id",
                "vendor_id"
            );
        }

        if (tableDefinition && tableDefinition["supplier_name"]) {
          return queryInterface.renameColumn(
              "vendor",
              "supplier_name",
              "vendor_name"
          );
      }

      if (tableDefinition && tableDefinition["supplier_url"]) {
        return queryInterface.renameColumn(
            "vendor",
            "supplier_url",
            "vendor_url"
        );
    }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("vendor");

        if (tableDefinition && tableDefinition["supplier_id"]) {
            return queryInterface.renameColumn(
                "vendor",
                "supplier_id",
                "vendor_id"
            );
        }

        if (tableDefinition && tableDefinition["supplier_name"]) {
          return queryInterface.renameColumn(
              "vendor",
              "supplier_name",
              "vendor_name"
          );
      }

      if (tableDefinition && tableDefinition["supplier_url"]) {
        return queryInterface.renameColumn(
            "vendor",
            "supplier_url",
            "vendor_url"
        );
    }
    },
};
