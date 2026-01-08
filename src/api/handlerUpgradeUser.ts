import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { upgradeUser } from "../db/queries/users.js";

export async function handlerUpgradeUser(req: Request, res: Response) {
    type parameters = {
        event: string;
        data: {
            userId: string;
        }
    };

    const params: parameters = req.body;

    if (params.event !== "user.upgraded") {
        respondWithJSON(res, 204, {});
        return;
    }

    await upgradeUser(params.data.userId);
    respondWithJSON(res, 204, {});
}