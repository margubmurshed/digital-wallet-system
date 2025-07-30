import dotenv from "dotenv";

dotenv.config();

interface envVarTypes {
    DB_URL: string;
    PORT: string;
    NODE_ENV: string;
    BCRYPT_SALT_ROUND: number;
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRES: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES: string;
    SUPER_ADMIN_PHONE: string;
    SUPER_ADMIN_PASS: string;
}

function loadEnvVars () : envVarTypes {
    const requiredEnvVars: string[] = [
        "DB_URL",
        "PORT",
        "NODE_ENV",
        "BCRYPT_SALT_ROUND",
        "JWT_ACCESS_SECRET",
        "JWT_ACCESS_EXPIRES",
        "JWT_REFRESH_SECRET",
        "JWT_REFRESH_EXPIRES",
        "SUPER_ADMIN_PHONE",
        "SUPER_ADMIN_PASS",
    ];
    requiredEnvVars.forEach(key => {
        if(!process.env[key]){
            throw new Error(`Missing required environment variable "${key}"`)
        }
    })

    return {
        DB_URL: process.env.DB_URL as string,
        PORT: process.env.PORT as string,
        NODE_ENV: process.env.NODE_ENV as string,
        BCRYPT_SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND),
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
        SUPER_ADMIN_PHONE: process.env.SUPER_ADMIN_PHONE as string,
        SUPER_ADMIN_PASS: process.env.SUPER_ADMIN_PASS as string,
    }
}

export const envVariables = loadEnvVars();