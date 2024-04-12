"use client";

import { useUserStore } from "../../lib/services/authentication/userStore";
import { TestLogout } from "./TestLogout";

export default function Logout() {
  const userStore = useUserStore();
  return (
    <div>
      {userStore.user && <p>{userStore.user.username}</p>}
      <TestLogout></TestLogout>
    </div>
  );
}
