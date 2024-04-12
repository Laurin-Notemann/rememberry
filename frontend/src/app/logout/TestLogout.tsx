"use client";
import { useRouter } from "next/navigation";
import { useLogoutUser } from "../../lib/services/authentication/useLogoutUser";

export const TestLogout = () => {
  const router = useRouter();
  const logout = useLogoutUser();
  const onClickLogout = async () => {
    const [error, _success] = await logout();

    if (error) return;

    router.push("/login");
  };
  return (
    <div>
      <button onClick={onClickLogout}>Logout</button>
    </div>
  );
};
