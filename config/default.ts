import dotenv from 'dotenv';

// Modify .env file in different environment
dotenv.config();

export default {
    ip: process.env.IP,
    port: process.env.PORT,
    domain: process.env.DOMAIN,
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
        sender: process.env.SMTP_SENDER
    },
    accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
    accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY
};