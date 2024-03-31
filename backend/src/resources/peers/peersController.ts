import { TRPCError } from "@trpc/server";
import * as peersModels from "./peersModels";

export async function controlPeerCreation(userId: string, peerName: string) {
  const [errorCheck, peer] = await peersModels.createPeer(peerName);
  if (errorCheck) {
    return [errorCheck, null] as const;
  }
  const peerId = peer.id;
  const [secondErrorCheck, relation] =
    await peersModels.createAdminPeerrelation(peerId, userId);
  if (secondErrorCheck) {
    return [secondErrorCheck, null] as const;
  }
  const res = {
    peer,
    relation,
  };
  return [null, res] as const;
}

export async function controlUpdatePeerName(
  newPeerName: string,
  peerId: string,
  userId: string,
) {
  const adminStatus = await peersModels.getAdminStatus(userId, peerId);
  if (adminStatus) {
    const res = await peersModels.updatePeerName(newPeerName, peerId);
    return [null, res] as const;
  }
  return [new TRPCError({ code: "UNAUTHORIZED" }), null] as const;
}

export async function controlKick(
  kickerId: string,
  kickedUserId: string,
  peerId: string,
) {
  const [errorCheck, adminStatus] = await peersModels.getAdminStatus(
    kickerId,
    peerId,
  );
  if (adminStatus) {
    const res = peersModels.kickMember(kickedUserId, peerId);
    return [null, res] as const;
  }
  if (errorCheck) {
    return [errorCheck, null] as const;
  }
  return [new TRPCError({ code: "UNAUTHORIZED" }), null];
}

export async function controlRemoveAdminStatus(
  userId: string,
  peerId: string,
  removerId: string,
) {
  const [error, adminStatus] = await peersModels.getAdminStatus(
    removerId,
    peerId,
  );
  if (error) {
    [error, null];
  } else if (!adminStatus) {
    [new TRPCError({ code: "UNAUTHORIZED" }), null];
  }
  const [secondError, res] = await peersModels.removeAdminStatus(
    userId,
    peerId,
  );
  if (secondError) {
    return [secondError, null];
  }
  return [null, res];
}

export async function controlAddAdminStatus(
  userId: string,
  peerId: string,
  removerId: string,
) {
  const [error, adminStatus] = await peersModels.getAdminStatus(
    removerId,
    peerId,
  );
  if (error) {
    [error, null];
  } else if (!adminStatus) {
    [new TRPCError({ code: "UNAUTHORIZED" }), null];
  }
  const [secondError, res] = await peersModels.addAdminStatus(userId, peerId);
  if (secondError) {
    return [secondError, null];
  }
  return [null, res];
}
