import { getBearerToken } from "../auth.js";
import { setRevokedAt } from "../db/queries/refreshTokens.js";
import { respondWithJSON } from "./json.js";
export async function handlerRevoke(req, res) {
    const bearerToken = getBearerToken(req);
    await setRevokedAt(bearerToken);
    respondWithJSON(res, 204, {});
}
