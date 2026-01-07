import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT } from "../auth.js";
import { UnauthorizedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";
export async function handlerLogin(req, res) {
    const params = req.body;
    const user = await getUserByEmail(params.email);
    if (!user) {
        throw new Error("unable to find user due to some internal problem");
    }
    if (!(await checkPasswordHash(params.password, user.hashedPassword))) {
        throw new UnauthorizedError("Incorrect email or password");
    }
    if (!params.expiresInSeconds) {
        params.expiresInSeconds = 3600;
    }
    else if (params.expiresInSeconds > 3600) {
        params.expiresInSeconds = 3600;
    }
    const token = makeJWT(user.id, params.expiresInSeconds, config.secret);
    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: token
    });
}
