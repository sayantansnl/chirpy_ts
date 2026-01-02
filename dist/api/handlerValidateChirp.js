import { respondWithError, respondWithJSON } from "./json.js";
import { filterProfaneWords } from "./filterProfaneWords.js";
export async function handlerValidateChirp(req, res) {
    const params = req.body;
    const maxLength = 140;
    if (params.body.length >= maxLength) {
        respondWithError(res, 400, "Chirp is too long");
        return;
    }
    respondWithJSON(res, 200, { cleanedBody: filterProfaneWords(params.body) });
}
