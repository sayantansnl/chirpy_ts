import * as argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserNotAuthenticatedError, UnauthorizedError } from "./api/errors.js";
import { Request } from "express";
import crypto from "crypto";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
const TOKEN_ISSUER = "chirpy";

export async function hashPassword(password: string): Promise<string> {
    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (err) {
        throw new Error(`Couldn't hash password: ${err}`);
    }
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    try {
        if (await argon2.verify(hash, password)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        throw new Error(`Couldn't verify if hashed: ${err}`);
    }
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const iat = Math.floor(Date.now() / 1000);
    const payload: Payload = {
        iss: TOKEN_ISSUER,
        sub: userID,
        iat: iat,
        exp: iat + expiresIn,
    };

    const token = jwt.sign(payload, secret);
    return token;
}

export function validateJWT(tokenString: string, secret: string) {
  let decoded: Payload;
  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (e) {
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

export function getBearerToken(req: Request): string {
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
    } catch (err) {
        throw new Error(`Couldn't generate bytes: ${err}`);
    }
}