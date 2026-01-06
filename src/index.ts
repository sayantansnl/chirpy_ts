import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerReadiness } from "./api/handlerReadiness.js";
import { middlewareHandleErrors, middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerCountServerHits } from "./api/handlerCountServerHits.js";
import { handlerReset } from "./api/handlerReset.js";
import { handlerCreateChirp } from "./api/handlerCreateChirp.js";
import { handlerCreateUser } from "./api/handlerCreateUser.js";
import { handlerGetAllChirps } from "./api/handlerGetAllChirps.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const PORT = config.api.port;

const app = express();
app.use(express.json());

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", async (req, res, next) => {
    try {
        await handlerReadiness(req, res);
    } catch (err) {
        next(err);
    }
});

app.get("/admin/metrics", async (req, res, next) => {
    try {
        await handlerCountServerHits(req, res);
    } catch (err) {
        next(err);
    }
});

app.post("/admin/reset", async (req, res, next) => {
    try {
        await handlerReset(req, res);
    } catch (err) {
        next(err);
    }
});

app.post("/api/chirps", async (req, res, next) => {
    try {
        await handlerCreateChirp(req, res);
    } catch (err) {
        next(err);
    }
});

app.post("/api/users", async (req, res, next) => {
    try {
        await handlerCreateUser(req, res);
    } catch (err) {
        next(err);
    }
});

app.get("/api/chirps", async (req, res, next) => {
    try {
        await handlerGetAllChirps(req, res);
    } catch (err) {
        next(err);
    }
})

app.use(middlewareHandleErrors);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});