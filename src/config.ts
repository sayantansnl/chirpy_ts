process.loadEnvFile();

type APIConfig = {
    fileServerHits: number;
    dbURL: string;
};

export const config: APIConfig = {
    fileServerHits: 0,
    dbURL: envOrThrow("DB_URL")
};

function envOrThrow(key: string) {
    if (typeof process.env[key] === "undefined") {
        throw new Error("key undefined");
    }
    return process.env[key];
}