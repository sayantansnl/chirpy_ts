const migrationConfig = {
    migrationsFolder: "./src/db/migrations",
};
process.loadEnvFile();
export const config = {
    api: {
        fileServerHits: 0,
        port: Number(envOrThrow("PORT")),
        platform: envOrThrow("PLATFORM")
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig
    },
    secret: envOrThrow("SECRET")
};
function envOrThrow(key) {
    if (typeof process.env[key] === "undefined") {
        throw new Error("key undefined");
    }
    return process.env[key];
}
