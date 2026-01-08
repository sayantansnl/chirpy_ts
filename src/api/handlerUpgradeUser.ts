import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { upgradeUser } from "../db/queries/users.js";
import { config } from "../config.js";
import { getAPIKey } from "../auth.js";
import { UnauthorizedError } from "./errors.js";

export async function handlerUpgradeUser(req: Request, res: Response) {
    type parameters = {
        event: string;
        data: {
            userId: string;
        }
    };

    const apiKey = getAPIKey(req);
    if (apiKey !== config.api.apiKey) {
        throw new UnauthorizedError("ApiKey mismatch!");
    }

    const params: parameters = req.body;

    if (params.event !== "user.upgraded") {
        respondWithJSON(res, 204, {});
        return;
    }

    await upgradeUser(params.data.userId);
    respondWithJSON(res, 204, {});
}