import { Request, Response } from "express";
import { updateUser } from "../db/queries/users.js";
import { hashPassword, getBearerToken, validateJWT } from "../auth.js";
import { UnauthorizedError, UserNotAuthenticatedError } from "./errors.js";
import { NewUser } from "../db/schema.js";
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";

export async function handlerUpdateUser(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
    };

    const params: parameters = req.body;

    const bearerToken = getBearerToken(req);
    if (!bearerToken) {
        throw new UserNotAuthenticatedError("action not allowed for unauthenticated users");
    }

    const userID = validateJWT(bearerToken, config.secret);
    const hashedPassword = await hashPassword(params.password);

    const user = await updateUser(params.email, hashedPassword, userID) as NewUser;
    if (!user) {
        throw new UnauthorizedError("action not allowed");
    }
    
    type UserPreview = Omit<NewUser, "hashedPassword">;
    const userPreview: UserPreview = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };

    respondWithJSON(res, 200, userPreview);
}