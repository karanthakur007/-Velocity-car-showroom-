import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName?: string, photoURL?: string) {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        displayName: displayName || null,
        photoURL: photoURL || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || null,
          photoURL: photoURL || null,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Failed to register/sync user in DB:", error);
    // Fallback: If conflict or any, try to fetch
    try {
      const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
      if (existing.length > 0) return existing[0];
    } catch (innerError) {
      console.error("Inner select user failed:", innerError);
    }
    throw new Error("User synchronization in PostgreSQL failed", { cause: error });
  }
}
