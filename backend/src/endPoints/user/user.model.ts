//import { TRPCError } from "@trpc/server";
//import { eq, ne, or } from "drizzle-orm";
//import { db } from "../../db/db";
//import * as schema from "../../db/schema";
//
////WRITE
//export async function writeUser(userInput: schema.NewUser, hashedPwd: string) {
//  const newUser = await db
//    .insert(schema.users)
//    .values({
//      username: userInput.username,
//      email: userInput.email,
//    })
//    .returning();
//  if (newUser.length < 1 || newUser.length > 1) {
//    return [new TRPCError({ code: "INTERNAL_SERVER_ERROR" }), null] as const;
//  }
//  return [null, newUser] as const;
//}
//
////READ
//export async function readAllUsers() {
//  const res = await db.select().from(schema.users);
//  if (res.length < 1) {
//    return [new TRPCError({ code: "INTERNAL_SERVER_ERROR" }), null] as const;
//  }
//  return [null, res] as const;
//}
//
//export async function checkUsername(username: string) {
//  const user = await db
//    .select()
//    .from(schema.users)
//    .where(eq(schema.users.username, username));
//  if (user[0]) {
//    return [null, true] as const;
//  }
//}
//
//export async function checkUserEmail(email: string) {
//  const user = await db
//    .select()
//    .from(schema.users)
//    .where(eq(schema.users.email, email));
//  if (user[0]) {
//    return [null, true] as const;
//  }
//}
//
//export async function checkCredentials(email: string, username: string) {
//  if ((await checkUserEmail(email)) && (await checkUsername(username))) {
//    return [
//      new TRPCError({
//        code: "FORBIDDEN",
//        message: "USERNAME AND EMAIL ALREADY EXIST",
//      }),
//      null,
//    ] as const;
//  } else if (await checkUserEmail(email)) {
//    return [
//      new TRPCError({ code: "FORBIDDEN", message: "EMAIL ALREADY EXISTS" }),
//      null,
//    ] as const;
//  } else if (await checkUsername(username)) {
//    return [
//      new TRPCError({ code: "FORBIDDEN", message: "USERNAME ALREADY EXISTS" }),
//      null,
//    ] as const;
//  }
//  return [null, true] as const;
//}
//
//export async function readUserById(userId: string) {
//  const user = await db
//    .select()
//    .from(schema.users)
//    .where(eq(schema.users.id, userId));
//  if (user.length < 1) {
//    return [new TRPCError({ code: "INTERNAL_SERVER_ERROR" }), null] as const;
//  }
//
//  return [null, user[0]];
//}
//
//export async function fetchUpdateCredentials(
//  email: string,
//  username: string,
//  userId: string,
//) {
//  const res = await db
//    .select()
//    .from(schema.users)
//    .where(
//      or(eq(schema.users.email, email), eq(schema.users.username, username)),
//    )
//    .where(ne(schema.users.id, userId));
//  return res;
//}
//
////UPDATE
//export async function updateUserById(
//  username: string,
//  userEmail: string,
//  hashedPwd: string,
//  userId: string,
//) {
//  const updatedUser = await db
//    .update(schema.users)
//    .set({
//      username: username,
//      email: userEmail,
//    })
//    .where(eq(schema.users.id, userId))
//    .returning();
//  if (updatedUser.length < 1) {
//    return [new TRPCError({ code: "INTERNAL_SERVER_ERROR" }), null] as const;
//  }
//  return [null, updatedUser[0]] as const;
//}
//
//export async function deleteUserById(userId: string) {
//  const deletedUser = await db
//    .delete(schema.users)
//    .where(eq(schema.users.id, userId))
//    .returning();
//  if (deletedUser.length < 1) {
//    return [new TRPCError({ code: "INTERNAL_SERVER_ERROR" }), null] as const;
//  }
//
//  return [null, deletedUser[0]] as const;
//}
