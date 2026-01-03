import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { filterProfaneWords } from "./filterProfaneWords.js";
import { BadRequestError } from "./errors.js";

export async function handlerValidateChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    const params: parameters = req.body;
    const maxLength = 140;

   if (params.body.length >= maxLength) {
    throw new BadRequestError(`Chirp is too long. Max length is ${maxLength}`);
   }

   respondWithJSON(res, 200, {cleanedBody : filterProfaneWords(params.body)});
}