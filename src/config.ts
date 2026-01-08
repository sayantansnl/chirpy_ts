import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations",
};

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
};

type APIConfig = {
    fileServerHits: number;
    port: number;
    platform: string;
    apiKey: string;
};

type Config = {
    api: APIConfig;
    db: DBConfig;
    secret: string;
};

process.loadEnvFile();

export const config: Config = {
    api: {
        fileServerHits: 0,
        port: Number(envOrThrow("PORT")),
        platform: envOrThrow("PLATFORM"),
        apiKey: envOrThrow("POLKA_KEY")
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig
    },
    secret: envOrThrow("SECRET")
};

function envOrThrow(key: string) {
    if (typeof process.env[key] === "undefined") {
        throw new Error("key undefined");
    }
    return process.env[key];
}