import { respondWithJSON } from "./json.js";
import { filterProfaneWords } from "./filterProfaneWords.js";
export async function handlerValidateChirp(req, res) {
    const params = req.body;
    const maxLength = 140;
    if (params.body.length >= maxLength) {
        throw new Error("Chirp is too long");
    }
    respondWithJSON(res, 200, { cleanedBody: filterProfaneWords(params.body) });
}
