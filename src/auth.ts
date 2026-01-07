import * as argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserNotAuthenticatedError } from "./api/errors.js";

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