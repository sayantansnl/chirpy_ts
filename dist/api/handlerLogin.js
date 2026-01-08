import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../auth.js";
import { UnauthorizedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";
import { createRefreshToken } from "../db/queries/refreshTokens.js";
export async function handlerLogin(req, res) {
    const params = req.body;
    const user = await getUserByEmail(params.email);
    if (!user) {
        throw new Error("unable to find user due to some internal problem");
    }
    if (!(await checkPasswordHash(params.password, user.hashedPassword))) {
        throw new UnauthorizedError("Incorrect email or password");
    }
    const rT = makeRefreshToken();
    const refToken = {
        userId: user.id,
        token: rT,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    };
    const newRefreshToken = await createRefreshToken(refToken);
    const token = makeJWT(user.id, refToken.expiresAt.getSeconds(), config.secret);
    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        isChirpyRed: user.isChirpyRed,
        token: token,
        refreshToken: newRefreshToken.token
    });
}
