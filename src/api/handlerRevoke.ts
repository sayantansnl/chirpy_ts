import { Request, Response } from "express";
import { getBearerToken } from "../auth.js";
import { setRevokedAt } from "../db/queries/refreshTokens.js";
import { respondWithJSON } from "./json.js";

export async function handlerRevoke(req: Request, res: Response) {
    const bearerToken = getBearerToken(req);

    await setRevokedAt(bearerToken);
    respondWithJSON(res, 204 , {});
}