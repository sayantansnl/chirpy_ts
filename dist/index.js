import express from "express";
import { handlerReadiness } from "./api/handlerReadiness.js";
import { middlewareHandleErrors, middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerCountServerHits } from "./api/handlerCountServerHits.js";
import { handlerReset } from "./api/handlerReset.js";
import { handlerValidateChirp } from "./api/handlerValidateChirp.js";
const app = express();
app.use(express.json());
const PORT = 8080;
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", async (req, res, next) => {
    try {
        await handlerReadiness(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.get("/admin/metrics", async (req, res, next) => {
    try {
        await handlerCountServerHits(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.post("/admin/reset", async (req, res, next) => {
    try {
        await handlerReset(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.post("/api/validate_chirp", async (req, res, next) => {
    try {
        await handlerValidateChirp(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.use(middlewareHandleErrors);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
