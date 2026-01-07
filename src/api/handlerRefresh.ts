import { Request, Response } from "express";
import { getBearerToken, makeJWT } from "../auth.js";
import { getRefreshToken } from "../db/queries/refreshTokens.js";
import { UnauthorizedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";

export async function handlerRefresh(req: Request, res: Response) {
    const bearerToken = getBearerToken(req);
    const refreshToken = await getRefreshToken(bearerToken);

    if (refreshToken.revokedAt) {
        throw new UnauthorizedError("Unauthorized action");
    }

    const jwt = makeJWT(refreshToken.userId, refreshToken.expiresAt.getSeconds(), config.secret)

    respondWithJSON(res, 200, {
        token: jwt
    });
}