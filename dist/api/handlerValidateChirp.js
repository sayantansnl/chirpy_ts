import { respondWithJSON } from "./json.js";
import { filterProfaneWords } from "./filterProfaneWords.js";
import { BadRequestError } from "./errors.js";
export async function handlerValidateChirp(req, res) {
    const params = req.body;
    const maxLength = 140;
    if (params.body.length >= maxLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxLength}`);
    }
    respondWithJSON(res, 200, { cleanedBody: filterProfaneWords(params.body) });
}
