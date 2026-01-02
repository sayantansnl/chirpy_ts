import express from "express";
import { handlerReadiness } from "./api/handlerReadiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerCountServerHits } from "./api/handlerCountServerHits.js";
import { handlerReset } from "./api/handlerReset.js";
import { handlerValidateChirp } from "./api/handlerValidateChirp.js";
const app = express();
app.use(express.json());
const PORT = 8080;
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerCountServerHits);
app.post("/admin/reset", handlerReset);
app.post("/api/validate_chirp", handlerValidateChirp);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
