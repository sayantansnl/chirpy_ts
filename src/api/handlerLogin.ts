import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash } from "../auth.js";
import { UnauthorizedError } from "./errors.js";
import { respondWithJSON } from "./json.js";

export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
    };

    const params: parameters = req.body;

    const user = await getUserByEmail(params.email);
    if (!user) {
        throw new Error("unable to find user due to some internal problem");
    }

    if (!(await checkPasswordHash(params.password, user.hashedPassword))) {
        throw new UnauthorizedError("Incorrect email or password");
    }

    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email
    });
}