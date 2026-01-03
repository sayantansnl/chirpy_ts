process.loadEnvFile();
export const config = {
    fileServerHits: 0,
    dbURL: envOrThrow("DB_URL")
};
function envOrThrow(key) {
    if (typeof process.env[key] === "undefined") {
        throw new Error("key undefined");
    }
    return process.env[key];
}
