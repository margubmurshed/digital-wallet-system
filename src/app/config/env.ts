import dotenv from "dotenv";

dotenv.config();

interface envVarTypes {
    DB_URL: string;
    PORT: string;
    NODE_ENV: string;
    BCRYPT_SALT_ROUND: number;
}

function loadEnvVars () : envVarTypes {
    const requiredEnvVars: string[] = [
        "DB_URL",
        "PORT",
        "NODE_ENV",
        "BCRYPT_SALT_ROUND"
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
    }
}

export const envVariables = loadEnvVars();