import { config } from "../config.js";
import { respondWithError } from "./json.js";
export function middlewareLogResponses(req, res, next) {
    res.on("finish", () => {
        if (res.statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
}
export function middlewareMetricsInc(_, res, next) {
    res.on("finish", () => config.fileServerHits++);
    next();
}
export function middlewareHandleErrors(err, _, res, __) {
    const statusCode = 500;
    const message = "Something went wrong on our end";
    console.log(err);
    respondWithError(res, statusCode, message);
}
