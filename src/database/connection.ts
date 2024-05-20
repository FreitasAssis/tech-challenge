import { Sequelize, Dialect } from "sequelize";

const dbHost =
  process.env.NODE_ENV === "prod"
    ? process.env.DB_HOST_PRD
    : process.env.NODE_ENV === "homolog"
    ? process.env.DB_HOST_HMG
    : process.env.DB_HOST;

const dbName =
  process.env.NODE_ENV === "prod"
    ? process.env.DB_NAME_PRD
    : process.env.NODE_ENV === "homolog"
    ? process.env.DB_NAME_HMG
    : process.env.DB_NAME;

const dbPassword =
  process.env.NODE_ENV === "prod"
    ? process.env.DB_PASSWORD_PRD
    : process.env.NODE_ENV === "homolog"
    ? process.env.DB_PASSWORD_HMG
    : process.env.DB_PASSWORD;

const dbMaxPoolConnection = process.env.NODE_ENV === "prod" ? 25 : 5;

const dbUser = process.env.DB_USER;
const dbPort = +process.env.DB_PORT;
const dbDialect = process.env.DB_DIALECT;

export const database = new Sequelize(dbName, dbUser, dbPassword, {
  port: dbPort,
  host: dbHost,
  dialect: dbDialect as Dialect,
  pool: {
    max: dbMaxPoolConnection,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
});

export const syncDb = async () => database.sync();
