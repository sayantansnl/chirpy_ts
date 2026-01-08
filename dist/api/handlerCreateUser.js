import { createUser } from "../db/queries/users.js";
import { v4 as uuidv4 } from "uuid";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
import { hashPassword } from "../auth.js";
export async function handlerCreateUser(req, res) {
    const params = req.body;
    if (!params.email) {
        throw new BadRequestError("Missing required fields");
    }
    const respParams = {
        email: params.email,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        hashedPassword: await hashPassword(params.password)
    };
    const newUser = await createUser(respParams);
    if (!newUser) {
        throw new Error("Couldn't create user");
    }
    const newUserPreview = {
        id: newUser.id,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        email: newUser.email,
        isChirpyRed: newUser.isChirpyRed
    };
    respondWithJSON(res, 201, newUserPreview);
}
