import { respondWithError, respondWithJSON } from "./json.js";
export async function handlerValidateChirp(req, res) {
    let params = req.body;
    const maxLength = 140;
    if (params.body.length >= maxLength) {
        respondWithError(res, 400, "Chirp is too long");
        return;
    }
    respondWithJSON(res, 200, { valid: true });
}
