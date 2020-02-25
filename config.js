let config = {};

config.database = {};

config.web = {};

config.database.host = process.env.DATABASE_HOST || "localhost";
config.database.user = process.env.DATABASE_USER || "root";
config.database.password = process.env.DATABASE_PASSWORD || "secret";
config.database.name = "user";
config.web.port = process.env.WEB_PORT || 8090;

module.exports = config;
