import { respondWithJSON } from "./json.js";
import { filterProfaneWords } from "./filterProfaneWords.js";
import { BadRequestError } from "./errors.js";
import { v4 as uuidv4 } from "uuid";
import { createChirp } from "../db/queries/chirps.js";
export async function handlerCreateChirp(req, res) {
    const params = req.body;
    const maxLength = 140;
    if (params.body.length >= maxLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxLength}`);
    }
    const respParams = {
        body: filterProfaneWords(params.body),
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: params.userId
    };
    const newChirp = await createChirp(respParams);
    if (!newChirp) {
        throw new Error("Couldn't create chirp");
    }
    respondWithJSON(res, 201, newChirp);
}
