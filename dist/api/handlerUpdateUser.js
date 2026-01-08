import { updateUser } from "../db/queries/users.js";
import { hashPassword, getBearerToken, validateJWT } from "../auth.js";
import { UnauthorizedError, UserNotAuthenticatedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";
export async function handlerUpdateUser(req, res) {
    const params = req.body;
    const bearerToken = getBearerToken(req);
    if (!bearerToken) {
        throw new UserNotAuthenticatedError("action not allowed for unauthenticated users");
    }
    const userID = validateJWT(bearerToken, config.secret);
    const hashedPassword = await hashPassword(params.password);
    const user = await updateUser(params.email, hashedPassword, userID);
    if (!user) {
        throw new UnauthorizedError("action not allowed");
    }
    const userPreview = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
    respondWithJSON(res, 200, userPreview);
}
