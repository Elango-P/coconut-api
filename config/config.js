require("dotenv").config();

// DB connect Data
const dbConnectionData = {
    url: "postgres://postgres:new_password@localhost:5432/vallaras_coconut_backup",
    dialect: 'postgres',
    "dialectOptions": {
        "ssl": {
            "rejectUnauthorized": false,
        }
      },
};

const {
    SENDGRID_API_KEY,
    AWS_REGION,
    AWS_KEY_ID,
    AWS_SECRET_KEY_ACCESS,
    AWS_BUCKET,
    DEFAULT_ADMIN_EMAIL,
    EMAIL_IMAGE_BASE_URL,
    FROM_EMAIL,
    FROM_EMAIL_DISPLAY_NAME,
    GOOGLE_CLIENT_ID,
    SHOPIFY_SHOP_NAME,
    SHOPIFY_API_KEY,
    SHOPIFY_PASSWORD,
    SHOPIFY_ADMIN_API_VERSION,
    DEFAULT_COMPANY,
    DEFAULT_PORTAL,
    DEFAULT_PORTAL_URL,
    SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD
} = process.env;

module.exports = {
    // Pointing To Development DB
	development: dbConnectionData,

	// Pointing To Production DB
	production: dbConnectionData,
    sendGridAPIKey:  "",
    aws: {
        region: "",
        accessKeyId: "",
        secretAccessKey: "",
        bucketName: "",
    },
    defaultAdminEmail: "",
    emailImageBaseUrl: "",
    fromEmail: "",
    fromEmailDisplayName: "",
    googleClientId: "",
    shopifyShopName: "",
    shopifyApiKey: "",
    shopifyPassword: "",
    shopifyAdminApiVersion: "",
    defaultCompany: "",
    defaultPortal: "",
    defaultPortalUrl: "",
    superAdminEmail: "superadmin@thidiff.com",
    superAdminPassword: "Password01*"
};