import { db } from "../index.js";
import { refreshTokens } from "../schema.js";
import { eq } from "drizzle-orm";
export async function createRefreshToken(newRefreshToken) {
    const [result] = await db.insert(refreshTokens).values(newRefreshToken).returning();
    return result;
}
export async function getRefreshToken(token) {
    const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));
    return result;
}
export async function getUserByRefreshToken(token) {
    const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));
    return result.userId;
}
export async function setRevokedAt(token) {
    await db.update(refreshTokens).set({
        updatedAt: new Date(),
        revokedAt: new Date()
    }).where(eq(refreshTokens.token, token));
}
