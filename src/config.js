import { config } from 'dotenv';
config();

export const BD_HOST = process.env.BD_HOST;
export const BD_DATABASE = process.env.BD_DATABASE;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_PORT = process.env.DB_PORT;
export const PORT = process.env.PORT || 3000;

