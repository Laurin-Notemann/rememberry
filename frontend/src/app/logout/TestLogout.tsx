"use client";
import { useRouter } from "next/navigation";
import useLogoutUser from "../../lib/services/authentication/useLogoutUser";

export default function TestLogout() {
  const router = useRouter();
  const logout = useLogoutUser();
  async function onClickLogout() {
    const [error, _success] = await logout();

    if (error) return;

    router.push("/login");
  }
  return (
    <div>
      <button onClick={onClickLogout}>Logout</button>
    </div>
  );
}
