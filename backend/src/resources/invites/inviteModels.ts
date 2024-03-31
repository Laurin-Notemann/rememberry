import { eq } from "drizzle-orm";
import { db } from "../../db/db";
import * as schema from "../../db/schema";

export async function createInvite(invite: schema.NewInvite) {
  const res = db.drizzle.insert(schema.invites).values(invite).returning();
}

export async function getById(inviteId: string): Promise<schema.Invite> {
  const invite = await db.drizzle
    .select()
    .from(schema.invites)
    .where(eq(schema.invites.id, inviteId));
  return invite[0];
}

export async function acceptInvite(invite: schema.Invite) {
  const res = await db.drizzle.transaction(async (tx) => {
    await tx.insert(schema.usersPeers).values({
      userId: invite.receiverId,
      peerId: invite.peerId,
    });
    //    if (invite) {
    //      await tx.delete(schema.invites).where(eq(schema.invites.id, invite.id));
    //    }
  });
  return res;
}
