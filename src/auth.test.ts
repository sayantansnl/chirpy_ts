import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash } from "./auth";
import { v4 as uuidv4 } from "uuid";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return true for another password", async () => {
    const result = await checkPasswordHash(password2, hash2);
    expect(result).toBe(true);
  });
});

describe("Validating JWT", () => {
    const userID = uuidv4();
    const secret = "secret";
    const expiresIn = 3600;
    let token: string;

    beforeAll(() => {
        token = makeJWT(userID, expiresIn, secret);
    })

    it("should be equal", () => {
        const foundId = validateJWT(token, secret);
        expect(foundId).toBe(userID);
    });
});