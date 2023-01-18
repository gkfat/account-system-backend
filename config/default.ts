import dotenv from 'dotenv';

// Modify .env file in different environment
dotenv.config();

export default {
    ip: process.env.IP,
    port: process.env.PORT,
    redirect_uri: process.env.REDIRECT_URI,
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
    aws: {
        region: process.env.AWS_REGION
    },
    smtp: {
        sender: process.env.SMTP_SENDER,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
    accessTokenSecret: {
        key: process.env.ACCESS_TOKEN_SECRET_KEY,
        expires: process.env.ACCESS_TOKEN_EXPIRES_TIME
    },
    refreshTokenSecret: {
        key: process.env.REFRESH_TOKEN_SECRET_KEY,
        expires: process.env.REFRESH_TOKEN_EXPIRES_TIME
    },
};