import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { UserNotAuthenticatedError, UnauthorizedError } from "./api/errors.js";
import crypto from "crypto";
const TOKEN_ISSUER = "chirpy";
export async function hashPassword(password) {
    try {
        const hash = await argon2.hash(password);
        return hash;
    }
    catch (err) {
        throw new Error(`Couldn't hash password: ${err}`);
    }
}
export async function checkPasswordHash(password, hash) {
    try {
        if (await argon2.verify(hash, password)) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        throw new Error(`Couldn't verify if hashed: ${err}`);
    }
}
export function makeJWT(userID, expiresIn, secret) {
    const iat = Math.floor(Date.now() / 1000);
    const payload = {
        iss: TOKEN_ISSUER,
        sub: userID,
        iat: iat,
        exp: iat + expiresIn,
    };
    const token = jwt.sign(payload, secret);
    return token;
}
export function validateJWT(tokenString, secret) {
    let decoded;
    try {
        decoded = jwt.verify(tokenString, secret);
    }
    catch (e) {
        throw new UserNotAuthenticatedError("Invalid token");
    }
    if (decoded.iss !== TOKEN_ISSUER) {
        throw new UserNotAuthenticatedError("Invalid issuer");
    }
    if (!decoded.sub) {
        throw new UserNotAuthenticatedError("No user ID in token");
    }
    return decoded.sub;
}
export function getBearerToken(req) {
    const tokenString = req.get("Authorization");
    if (!tokenString) {
        throw new UnauthorizedError("No auth header included");
    }
    const splittedToken = tokenString.trim().split(" ");
    if (splittedToken.length !== 2 || splittedToken[0] !== "Bearer") {
        throw new UnauthorizedError("Malformed authorization header");
    }
    return splittedToken[1];
}
export function makeRefreshToken() {
    try {
        const key = crypto.randomBytes(256).toString("hex");
        return key;
    }
    catch (err) {
        throw new Error(`Couldn't generate bytes: ${err}`);
    }
}
export function getAPIKey(req) {
    const key = req.get("Authorization");
    if (!key) {
        throw new UnauthorizedError("No auth header included");
    }
    const splittedKey = key?.split(" ");
    if (splittedKey.length !== 2 || splittedKey[0] !== "ApiKey") {
        throw new UnauthorizedError("Malformed API key");
    }
    return splittedKey[1].trim();
}
