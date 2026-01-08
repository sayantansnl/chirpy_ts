import { db } from "../index.js";
import { chirps } from "../schema.js";
import { and, eq } from "drizzle-orm";
export async function createChirp(chirp) {
    const [result] = await db.insert(chirps).values(chirp).onConflictDoNothing().returning();
    return result;
}
export async function getAllChirps() {
    const result = await db.select().from(chirps).orderBy(chirps.createdAt);
    return result;
}
export async function getChirpById(id) {
    const [result] = await db.select().from(chirps).where(eq(chirps.id, id));
    return result;
}
export async function deleteChirp(chirpID, userID) {
    await db.delete(chirps).where(and(eq(chirps.id, chirpID), eq(chirps.userId, userID)));
}
