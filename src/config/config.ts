
const path = require("path");
const env = (process.env.NODE_ENV || "development").trim();

switch (env) {
    case "test":
        require("dotenv").config({
            path: path.join(__dirname, "..", "..", ".env.test"),
        });
        break;
    case "development":
        console.log('require("dotenv").config();');
        require("dotenv").config();
        break;
    default:
}

type configType = {
    mode: string;
    connection: {
        host?: string;
        user?: string;
        password?: string;
        database?: string;
    };
};

const config: configType = {
    mode: env,
    connection: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    }
};

export default config;
