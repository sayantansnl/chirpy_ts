import { config } from "../config.js";
import { respondWithError } from "./json.js";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError, UserNotAuthenticatedError } from "./errors.js";
export function middlewareLogResponses(req, res, next) {
    res.on("finish", () => {
        if (res.statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
}
export function middlewareMetricsInc(_, res, next) {
    res.on("finish", () => config.api.fileServerHits++);
    next();
}
export function middlewareHandleErrors(err, _, res, __) {
    if (err instanceof BadRequestError) {
        respondWithError(res, 400, err.message);
    }
    else if (err instanceof UnauthorizedError || err instanceof UserNotAuthenticatedError) {
        respondWithError(res, 401, err.message);
    }
    else if (err instanceof ForbiddenError) {
        respondWithError(res, 403, err.message);
    }
    else if (err instanceof NotFoundError) {
        respondWithError(res, 404, err.message);
    }
    else {
        respondWithError(res, 500, "Internal Server Error");
    }
}
