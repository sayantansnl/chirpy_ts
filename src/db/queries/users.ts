import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
    const [result] = await db.insert(users).values(user).onConflictDoNothing().returning();
    return result;
}

export async function deleteUsers() {
    await db.delete(users);
}

export async function getUserByEmail(email: string) {
    const [result] = await db.select().from(users).where(eq(users.email, email));
    return result;
}

export async function updateUser(email: string, hashedPassword: string, userID: string) {
    const [result] = await db.update(users).set({
        updatedAt: new Date(),
        email: email,
        hashedPassword: hashedPassword
    }).where(eq(users.id, userID)).returning();
    return result;
}