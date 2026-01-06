import { Request, Response } from "express";
import { getChirpById } from "../db/queries/chirps.js";
import { NotFoundError } from "./errors.js";
import { respondWithJSON } from "./json.js";

export async function handlerGetChirpById(req: Request, res: Response) {
    const { chirpID } = req.params;
    const chirp = await getChirpById(chirpID);
    if (!chirp) {
        throw new NotFoundError("Couldn't find chirp");
    }
    respondWithJSON(res, 200, chirp);
}