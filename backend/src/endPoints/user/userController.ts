import * as schema from "../../db/schema";
import * as types from "./types";
import * as userModel from "./user.model";
import bcrypt from "bcryptjs";
import { TRPCError } from "trpc";

export async function controlUserCreation(
  userInput: schema.NewUser,
  db: types.dbConnection
) {
  await userModel.checkCredentials(userInput.email, userInput.username, db);
  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(userInput.password, salt);
  const res = await userModel.writeUser(userInput, db, hashedPwd);
  return res;
}

export async function getAllUsers(db: types.dbConnection) {
  const res = await userModel.readAllUsers(db);
  return res;
}

export async function getUserById(userId: string, db: types.dbConnection) {
  const res = await userModel.readUserById(userId, db);
  return res;
}

export async function controlUserUpdateById(
  userInput: schema.User,
  db: types.dbConnection
) {
  const updateCredentials = await userModel.fetchUpdateCredentials(
    userInput,
    db
  );
  checkUpdateCredentials(updateCredentials, userInput);
  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(userInput.password, salt);
  const res = await userModel.updateUserById(userInput, hashedPwd, db);
  return res;
}

function checkUpdateCredentials(
  fetchedUser: schema.User[],
  userInput: schema.User
) {
  for (let i = 0; i < fetchedUser.length; i++) {
    if (
      fetchedUser[i].email === userInput.email &&
      fetchedUser[i].username === userInput.username
    ) {
      throw new TRPCError(403, { message: "USERNAME AND EMAIL ALREADY EXIST" });
    } else if (fetchedUser[i].email === userInput.email) {
      throw new TRPCError(403, { message: "EMAIL ALREADY EXISTS" });
    } else if (fetchedUser[i].username === userInput.username) {
      throw new TRPCError(403, { message: "USERNAME ALREADY EXISTS" });
    }
  }
}

export async function controlUserDeletionById(
  userId: string,
  db: types.dbConnection
) {
  const res = await userModel.deleteUserById(userId, db);
  return res;
}