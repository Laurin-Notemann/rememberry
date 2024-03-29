import { env } from "@/lib/env";
import { User } from "./userStore";

type FetchedUser = {
  status: "error" | "successful";
  error?: string;
  user?: User;
};

export async function userLoader(session?: string) {
  if (!session) return null;
  const host = getHost();
  const url = host + "/api/auth/user?session=" + session;

  // TODO: proper error handling
  try {
    const response = await fetch(url);

    const user: FetchedUser = await response.json();

    if (response.status === 400 || !user.user) return null;

    return user.user;
  } catch (err) {
    console.error("userLoader:", url, err);

    return null;
  }
}

const getHost = () => {
  if (env.IS_DEV) {
    // TODO: un-hardcode these
    return "http://127.0.0.1:3001";
  } else if (env.IS_STAGING) {
    return "https://web.stage.rememberry.app";
  } else {
    return "https://rememberry.app";
  }
};
