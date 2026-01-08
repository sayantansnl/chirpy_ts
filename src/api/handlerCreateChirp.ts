import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { filterProfaneWords } from "./filterProfaneWords.js";
import { BadRequestError } from "./errors.js";
import { NewChirp } from "../db/schema.js";
import { v4 as uuidv4 } from "uuid";
import { createChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

export async function handlerCreateChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    const params: parameters = req.body;
    const maxLength = 140;

   if (params.body.length > maxLength) {
    throw new BadRequestError(`Chirp is too long. Max length is ${maxLength}`);
   }

   const token = getBearerToken(req);
   const foundUserId = validateJWT(token, config.secret);

   

   const respParams: NewChirp = {
    body: filterProfaneWords(params.body),
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: foundUserId
   };

   const newChirp = await createChirp(respParams);
   if (!newChirp) {
    throw new Error("Couldn't create chirp");
   }

   respondWithJSON(res, 201, newChirp);
}