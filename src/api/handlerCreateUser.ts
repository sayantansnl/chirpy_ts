import { Request, Response } from "express";
import { NewUser } from "../db/schema.js";
import { createUser } from "../db/queries/users.js";
import { v4 as uuidv4 } from "uuid";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";

export async function handlerCreateUser(req: Request, res: Response) {
    type parameters = {
        email: string;
    };

    const params: parameters = req.body;

    if (!params.email) {
        throw new BadRequestError("Missing required fields");
    }

    const respParams: NewUser = {
        email: params.email,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const newUser = await createUser(respParams);
    if (!newUser) {
        throw new Error("Couldn't create user");
    }
    
    respondWithJSON(res, 201, newUser);
}