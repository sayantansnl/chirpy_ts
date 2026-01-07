import { db } from "../index.js";
import { refreshTokens, NewRefreshToken } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createRefreshToken(newRefreshToken: NewRefreshToken) {
    const [result] = await db.insert(refreshTokens).values(newRefreshToken).returning();
    return result;
}

export async function getRefreshToken(token: string) {
    const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));
    return result;
}

export async function getUserByRefreshToken(token: string) {
    const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));
    return result.userId;
}

export async function setRevokedAt(token: string) {
    await db.update(refreshTokens).set({
        updatedAt: new Date(),
        revokedAt: new Date()
    }).where(eq(refreshTokens.token, token));
}