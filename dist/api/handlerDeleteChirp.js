import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { deleteChirp, getChirpById } from "../db/queries/chirps.js";
import { respondWithJSON } from "./json.js";
import { ForbiddenError } from "./errors.js";
export async function handlerDeleteChirp(req, res) {
    const bearerToken = getBearerToken(req);
    const userID = validateJWT(bearerToken, config.secret);
    if (!userID) {
        throw new ForbiddenError("userID mismatch. Forbidden action.");
    }
    const { chirpID } = req.params;
    const chirp = await getChirpById(chirpID);
    if (chirp.userId !== userID) {
        throw new ForbiddenError("Action not allowed.");
    }
    await deleteChirp(chirpID, userID);
    respondWithJSON(res, 204, {});
}
