import { respondWithJSON } from "./json.js";
import { upgradeUser } from "../db/queries/users.js";
export async function handlerUpgradeUser(req, res) {
    const params = req.body;
    if (params.event !== "user.upgraded") {
        respondWithJSON(res, 204, {});
        return;
    }
    await upgradeUser(params.data.userId);
    respondWithJSON(res, 204, {});
}
